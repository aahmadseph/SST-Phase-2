/* eslint-disable consistent-return */
/* eslint-disable camelcase */
import UUIDv4 from 'utils/UUID';
import {
    STATUS, EVENT_TYPES, MESSAGE_TYPES, ERROR_CODES, RESPONSE_TYPES
} from 'ai/constants/superchat';

class GenAISocketService {
    constructor() {
        this.socket = null;
        this.messageCallbacks = [];
        this.connectionStatus = STATUS.DISCONNECTED;
        this.lastMessageId = null;
        this.connectionError = null;
        this.connectAttempts = 0;
        this.maxConnectAttempts = 3;
        this.sessionId = null;
        this.token = null;
        this.connectTimeout = null;
        this.language = 'en';
        this.country = 'US';
        this.heartbeat = null;
        this.heartbeatInterval = 15000; // 15 seconds
        this.clientId = null;
    }

    async connect(token, sessionId, language = 'en', country = 'US', clientId = null, anonymousId = null, attemptNumber = 0) {
        // Store these for potential reconnection needs
        this.token = token;
        this.sessionId = sessionId;
        this.language = language;
        this.country = country;
        this.clientId = clientId;
        this.anonymousId = anonymousId;

        if (this.socket) {
            this.disconnect();
        }

        // Clear any pending connect timeouts
        if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
        }

        this.connectAttempts = attemptNumber;
        this.connectionStatus = STATUS.CONNECTING;
        this.connectionError = null;

        this._notifyCallbacks({ type: EVENT_TYPES.CONNECTION, status: STATUS.CONNECTING, error: null });

        Sephora.logger.verbose(
            `SuperChat: Attempting to connect to WebSocket (attempt ${this.connectAttempts + 1}/${this.maxConnectAttempts + 1})...`
        );

        // Give a small delay between attempts for network stability
        if (attemptNumber > 0) {
            await new Promise(res => setTimeout(res, 100 * attemptNumber));
        }

        try {
            // Use the port from the current window location
            const host = Sephora.configurationSettings.sdnApiHost.replace('https://', 'wss://');

            const queryParams = new URLSearchParams({
                token: token,
                genai_pa_session_id: sessionId
            });

            if (this.clientId) {
                queryParams.append('client_id', this.clientId);
            }

            if (this.anonymousId) {
                queryParams.append('anonymous_id', this.anonymousId);
            }

            // Diagnostic information about the connection
            Sephora.logger.verbose(`SuperChat: Connecting to WebSocket using ${host}/v1/genai-pa-manager/ws-interaction`);
            Sephora.logger.verbose(`SuperChat: Current window.location: ${window.location.href}`);

            const wsUrl = `${host}/v1/genai-pa-manager/ws-interaction?${queryParams.toString()}`;

            this.socket = new WebSocket(wsUrl);

            // Set a proper timeout for the connection attempt
            const connectionTimeout = setTimeout(() => {
                if (this.socket && this.socket.readyState !== 1) {
                    Sephora.logger.verbose('SuperChat: WebSocket connection timeout - closing socket');
                    this.socket.close();
                }
            }, 10000); // 10 second timeout

            this.socket.onopen = () => {
                clearTimeout(connectionTimeout);
                Sephora.logger.verbose('SuperChat: WebSocket connection established successfully!');

                // Update connection status to 'connected'
                this.connectionStatus = STATUS.CONNECTED;
                this._notifyCallbacks({ type: EVENT_TYPES.CONNECTION, status: STATUS.CONNECTED, error: null });
            };

            this.socket.onmessage = event => {
                let data;
                try {
                    data = JSON.parse(event.data);

                    if (data.response_type === RESPONSE_TYPES.PONG_RESPONSE) {
                        return;
                    }

                    Sephora.logger.verbose('SuperChat: WebSocket message received:', data);

                    // If this is a message response, extract the message ID
                    if (data.data) {
                        this._handleMessageResponse(data);
                    }
                } catch {
                    data = { type: EVENT_TYPES.MESSAGE, data: event.data };
                }
                this._notifyCallbacks(data);
            };

            this.socket.onerror = error => {
                clearTimeout(connectionTimeout);
                Sephora.logger.verbose('SuperChat: WebSocket error details:', {
                    url: wsUrl,
                    readyState: this.socket.readyState,
                    browserProtocol: window.location.protocol,
                    error: error
                });

                this.connectionError = 'WebSocket error - Unable to connect to the server';
                this._notifyCallbacks({
                    type: EVENT_TYPES.CONNECTION,
                    status: STATUS.ERROR,
                    error: 'WebSocket connection error. Possible causes: SSL certificate issues, server not running, or network problems.'
                });
            };

            this.socket.onclose = event => {
                this.disconnect();
                clearTimeout(connectionTimeout);
                Sephora.logger.verbose('SuperChat: WebSocket connection closed with code:', event.code);

                if (event.code === ERROR_CODES.ABNORMAL_CLOSURE) {
                    this.connect(this.token, this.sessionId, this.language, this.country, this.clientId, this.anonymousId, this.connectAttempts);
                    Sephora.logger.verbose('SuperChat: Reconnecting due to abnormal closure (1006)');

                    return;
                }

                this.connectionStatus = STATUS.DISCONNECTED;
                this._notifyCallbacks({
                    type: EVENT_TYPES.CONNECTION,
                    status: STATUS.DISCONNECTED,
                    error: `WebSocket closed (Code: ${event.code}${event.reason ? ' - ' + event.reason : ''})`
                });
            };

            // Start the heartbeat to keep the connection alive
            this.sendHeartbeat();

            return this.socket;
        } catch (error) {
            Sephora.logger.verbose('SuperChat: Error initializing socket:', error);

            // Retry logic for initialization errors
            if (this.connectAttempts < this.maxConnectAttempts) {
                this.connectAttempts++;
                const retryDelay = Math.min(1000 * Math.pow(2, this.connectAttempts), 10000);

                Sephora.logger.verbose(
                    `SuperChat: Will retry socket initialization in ${retryDelay}ms (attempt ${this.connectAttempts}/${this.maxConnectAttempts})`
                );

                this.connectionStatus = STATUS.RETRYING;
                this.connectionError = `Init error: ${error.message || error}. Retrying...`;
                this._notifyCallbacks({
                    type: EVENT_TYPES.CONNECTION,
                    status: STATUS.RETRYING,
                    error: this.connectionError
                });

                // Retry connection after delay
                this.connectTimeout = setTimeout(() => {
                    this.connect(this.token, this.sessionId, this.language, this.country, this.clientId, this.anonymousId, this.connectAttempts);
                }, retryDelay);
            } else {
                this.connectionStatus = STATUS.ERROR;
                this.connectionError = `Init error after ${this.maxConnectAttempts + 1} attempts: ${error.message || error}`;
                this._notifyCallbacks({
                    type: EVENT_TYPES.CONNECTION,
                    status: STATUS.ERROR,
                    error: this.connectionError
                });
            }
        }
    }

    generatePayload(initial, data) {
        const messageId = UUIDv4();

        const payload = {
            language: this.language.toLocaleLowerCase(),
            session_id: this.sessionId,
            message_id: messageId,
            campaign_name: 'product-advisor',
            data: data,
            formattingLocale: `${this.language.toLocaleLowerCase()}_${this.country}`
        };

        if (initial) {
            payload.message_type = MESSAGE_TYPES.NEW_CONNECTION_REQUEST;

            return payload;
        }

        payload.message_type = MESSAGE_TYPES.USER_QUERY;
        payload.previous_message_id = this.lastMessageId;

        return payload;
    }

    disconnect() {
        if (this.connectTimeout) {
            clearTimeout(this.connectTimeout);
            this.connectTimeout = null;
        }

        if (this.socket) {
            this.socket = null;
            this.connectionStatus = STATUS.DISCONNECTED;
        }

        if (this.heartbeat) {
            clearInterval(this.heartbeat);
            this.heartbeat = null;
        }
    }

    sendInitialConnection(data) {
        if (!this.socket || this.connectionStatus !== STATUS.CONNECTED) {
            Sephora.logger.verbose('SuperChat: Socket not connected, cannot send initial connection');

            // Queue this request to be sent when connection is established
            this.onMessage(event => {
                if (event.type === EVENT_TYPES.CONNECTION && event.status === STATUS.CONNECTED) {
                    setTimeout(() => this.sendInitialConnection(data), 500);
                }
            });

            return;
        }

        const payload = this.generatePayload(true, data);

        Sephora.logger.verbose('SuperChat: Sending initial connection payload:', JSON.stringify(payload));

        this.socket.send(JSON.stringify(payload));
        this.connectionStatus = STATUS.AWAITING_RESPONSE;

        // Update lastMessageId with the initial connection message ID
        this.lastMessageId = payload.message_id;
        Sephora.logger.verbose(`SuperChat: Updated lastMessageId after sending initial connection: ${payload.message_id}`);

        return payload.message_id;
    }

    sendUserQuery(query) {
        if (
            !this.socket ||
            (this.connectionStatus !== STATUS.CONNECTED &&
                this.connectionStatus !== STATUS.AWAITING_RESPONSE &&
                this.connectionStatus !== STATUS.AWAITING_USER_RESPONSE)
        ) {
            Sephora.logger.verbose(`SuperChat: Socket not connected (status: ${this.connectionStatus}), cannot send user query`);

            return;
        }

        // Add logging to check socket state
        Sephora.logger.verbose(`SuperChat: Attempting to send user query. Socket state: ${this.socket.readyState}`);
        const cleanQuery = typeof query === 'string' ? query.trim() : String(query);
        const payload = this.generatePayload(false, { query: cleanQuery });

        Sephora.logger.verbose('SuperChat: Sending user query payload:', JSON.stringify(payload));
        this.socket.send(JSON.stringify(payload));

        // Update lastMessageId with the user's message ID for feedback purposes
        this.lastMessageId = payload.message_id;
        Sephora.logger.verbose(`SuperChat: Updated lastMessageId after sending user query: ${payload.message_id}`);

        return payload.message_id;
    }

    onMessage(callback) {
        if (typeof callback === 'function') {
            this.messageCallbacks.push(callback);
        }
    }

    sendHeartbeat() {
        if (this.heartbeat) {
            clearInterval(this.heartbeat);
        }

        this.heartbeat = setInterval(() => {
            if (this.socket && this.socket.readyState === WebSocket.OPEN) {
                const payload = {
                    message_type: MESSAGE_TYPES.USER_PING
                };

                this.socket.send(JSON.stringify(payload));
            } else {
                Sephora.logger.verbose('SuperChat: Cannot send heartbeat, socket not open');
            }
        }, this.heartbeatInterval);
    }

    _notifyCallbacks(data) {
        this.messageCallbacks.forEach(callback => {
            try {
                callback(data);
            } catch (e) {
                Sephora.logger.verbose('SuperChat: Error in message callback:', e);
            }
        });
    }

    _handleMessageResponse(data) {
        if (data && data.message_id) {
            Sephora.logger.verbose(`SuperChat: Received message with ID: ${data.message_id}`);

            // Only update lastMessageId if we're not already processing a user query
            // This prevents overwriting the ID of the user's message
            if (this.connectionStatus !== STATUS.AWAITING_USER_RESPONSE) {
                this.lastMessageId = data.message_id;
                this.connectionStatus = STATUS.AWAITING_USER_RESPONSE;
                Sephora.logger.verbose(`SuperChat: Updated lastMessageId from response: ${data.message_id}`);
            }
        }
    }
}

export default new GenAISocketService();
