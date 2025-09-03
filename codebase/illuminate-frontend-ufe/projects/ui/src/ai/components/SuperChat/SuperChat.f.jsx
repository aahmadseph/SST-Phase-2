/* eslint-disable camelcase */
import React, { useEffect, useState } from 'react';
import FrameworkUtils from 'utils/framework';
import { Flex } from 'components/ui';
import { mediaQueries, zIndices } from 'style/config';
import {
    STATUS, EVENT_TYPES, MESSAGE_TYPES, RESPONSE_TYPES, ENTRYPOINTS
} from 'ai/constants/superchat';
import genAISocketService from 'ai/services/socket/socketService';
import SuperChatHeader from 'ai/components/SuperChat/SuperChatHeader/SuperChatHeader';
import PreSelectedPrompts from 'ai/components/SuperChat/PreSelectedPrompts/PreSelectedPrompts';
import InputBar from 'ai/components/SuperChat/InputBar/InputBar';
import ErrorMessage from 'ai/components/SuperChat/ErrorMessage/ErrorMessage';
import Messages from 'ai/components/SuperChat/Messages/Messages';
import InitialMessages from 'ai/components/SuperChat/InitialMessages/InitialMessages';
import SuperChatFlyout from 'ai/components/SuperChat/SuperChatFlyout/SuperChatFlyout';
import ContextualDivider from 'ai/components/SuperChat/ContextualDivider/ContextualDivider';

import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';

// Util functions
import { setGENAISession } from 'ai/utils/sessionStorage';
import mapPreviousConversations from 'ai/utils/mapPreviousConversations';
import findPreviousSession from 'ai/utils/findPreviousSession';

const { wrapFunctionalComponent } = FrameworkUtils;

function SuperChat(props) {
    const {
        localization,
        entryPointData,
        prompts,
        showSuperChat,
        createSession,
        closeSuperChat,
        config,
        language,
        country,
        clientId,
        isSignInModalOpen,
        anonymousId,
        fetchPreviousConversations,
        productBrandName,
        productName,
        nthCategoryName
    } = props;

    if (!showSuperChat) {
        return null;
    }

    const [previousMessages, setPreviousMessages] = useState([]);
    const [messages, setMessages] = useState([]);
    const [sessionId, setSessionId] = useState('');
    const [hiddenContextualChips, setHiddenContextualChips] = useState(new Set());
    const [latestContextualChipIndex, setLatestContextualChipIndex] = useState(-1);
    const [isLoading, setIsLoading] = useState(true);
    const [showFlyer, setShowFlyer] = useState(false);
    const [showErrorMessage, setShowErrorMessage] = useState(false);
    const [showFeedbackInMessages, setShowFeedbackInMessages] = useState(false);
    const [isLoadingPrevious, setIsLoadingPrevious] = useState(false);
    const [lastUserMessage, setLastUserMessage] = useState('');
    const [hasSelectedPrompt, setHasSelectedPrompt] = useState(false);

    const initialize = async () => {
        try {
            let sessionFound = null;

            setIsLoadingPrevious(true);
            const conversationResponse = await fetchPreviousConversations(clientId, anonymousId);
            const mappedConversationsArr = mapPreviousConversations(conversationResponse);

            setPreviousMessages(mappedConversationsArr);
            setIsLoadingPrevious(false);
            setShowErrorMessage(false);

            if (mappedConversationsArr.length > 0) {
                sessionFound = findPreviousSession(conversationResponse, entryPointData);
            }

            if (entryPointData?.sessionId) {
                sessionFound = entryPointData?.sessionId;
            }

            const sessionResponse = await createSession(sessionFound);
            genAISocketService.connect(sessionResponse.token, sessionResponse.genai_pa_session_id, language, country, clientId, anonymousId);
            setSessionId(sessionResponse.genai_pa_session_id);
            // Store the session ID to validate if we have started any conversation, and display the minimized chat button
            setGENAISession({
                sessionId: sessionResponse.genai_pa_session_id,
                clientId: clientId,
                anonymousId: anonymousId,
                ...entryPointData
            });
            genAISocketService.onMessage(handleSocketMessage);
        } catch (error) {
            Sephora.logger.verbose('SuperChat: Failed to initialize Super Chat:', error);
            setIsLoading(false);
            setShowErrorMessage(true);
        }
    };

    useEffect(() => {
        initialize();

        return () => {
            genAISocketService.disconnect();
        };
    }, []);

    const handleSocketMessage = event => {
        if (event.type === EVENT_TYPES.CONNECTION) {
            switch (event.status) {
                case STATUS.DISCONNECTED:
                    handleClose();

                    break;
                case STATUS.CONNECTED:
                    Sephora.logger.verbose('SuperChat: WebSocket connected.');
                    genAISocketService.sendInitialConnection(entryPointData);

                    // If there's a selected prompt from entryPointData, send it automatically
                    if (entryPointData?.selectedPrompt) {
                        setHasSelectedPrompt(true);
                    }

                    break;
                default:
                    break;
            }
        } else {
            // Hide loading when we receive any response
            setIsLoading(false);

            setMessages(prev => {
                const newMessages = [...prev, event];

                // Track the index of the latest contextual chip message
                if (event.response_type === RESPONSE_TYPES.FOLLOW_UP_MESSAGES_RESPONSE) {
                    setLatestContextualChipIndex(newMessages.length - 1);
                    setHiddenContextualChips(new Set()); // Reset hidden chips for new contextual chips
                }

                return newMessages;
            });
        }
    };

    useEffect(() => {
        if (hasSelectedPrompt && messages.length > 0 && messages.some(msg => msg.response_type === RESPONSE_TYPES.FOLLOW_UP_MESSAGES_RESPONSE)) {
            const lastContextualChip = messages.findIndex(message => message.response_type === RESPONSE_TYPES.FOLLOW_UP_MESSAGES_RESPONSE);
            setHiddenContextualChips(prev => new Set(prev).add(lastContextualChip));
            sendMessage(entryPointData.selectedPrompt);

            setHasSelectedPrompt(false);
        }
    }, [messages]);

    const handleContextualChipClick = (messageIndex, chip) => {
        // Send the message
        sendMessage(chip.content);

        // Hide this contextual chip message
        setHiddenContextualChips(prev => new Set(prev).add(messageIndex));
    };

    const sendAnalytics = () => {
        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                pageName: `${anaConsts.SUPER_CHAT.SUPERCHAT_LANDING}`,
                actionInfo: `${anaConsts.SUPER_CHAT.SUPERCHAT_EXIT}` // prop55
            }
        });
    };

    const handleClose = () => {
        sendAnalytics();
        genAISocketService.disconnect();
        closeSuperChat();
    };

    const sendMessage = message => {
        if (!message || !message.trim()) {
            return;
        }

        // Store the last user message for resend functionality
        setLastUserMessage(message.trim());

        // Send the user query through the socket service
        const messageId = genAISocketService.sendUserQuery(message.trim());

        if (messageId) {
            // Add the user message to the local messages state for immediate UI feedback
            const userMessage = {
                type: EVENT_TYPES.MESSAGE,
                message_type: MESSAGE_TYPES.USER_QUERY,
                data: {
                    query: message.trim()
                }
            };
            setMessages(prev => [...prev, userMessage]);

            // Show loading indicator
            setIsLoading(true);
            setShowErrorMessage(false);
        } else {
            // Handle case when messageId is not returned (send failed)
            setShowErrorMessage(true);
            setIsLoading(false);
        }
    };

    const handleShowFeedback = () => {
        // Close the flyer and show feedback in messages
        setShowFlyer(false);
        setShowFeedbackInMessages(true);
    };

    const handleCloseFeedback = () => {
        setShowFeedbackInMessages(false);
    };

    const handleToggleFlyer = () => {
        setShowFlyer(!showFlyer);
    };

    const handleResendMessage = () => {
        setShowErrorMessage(false);

        if (lastUserMessage) {
            // If user has provided a message before, resend it
            sendMessage(lastUserMessage);
        } else {
            // If no user message was provided (initial state), show loading and process as usual
            setIsLoading(true);
            // The socket service should handle the initial connection
            initialize();
        }
    };

    return (
        <>
            <div
                css={[
                    styles.fixed,
                    styles.backdrop,
                    {
                        [mediaQueries.smMax]: {
                            display: isSignInModalOpen ? 'none' : 'block'
                        }
                    }
                ]}
                style={{ opacity: 1 }}
            />
            <Flex
                css={[
                    styles.superChatContainer,
                    {
                        [mediaQueries.smMax]: {
                            zIndex: isSignInModalOpen ? zIndices.flyout : zIndices.max
                        }
                    }
                ]}
                right={[0, 3]}
            >
                <Flex
                    height='100%'
                    position='relative'
                    flexDirection='column'
                    justifyContent='flex-end'
                    alignItems='flex-start'
                    css={styles.container}
                >
                    <SuperChatHeader
                        title={config?.meta?.bot_name || localization.title}
                        handleToggleFlyer={handleToggleFlyer}
                        showFlyer={showFlyer}
                        handleClose={handleClose}
                    />

                    {/* Chat Content Area */}
                    <Flex
                        flex='1'
                        width='100%'
                        backgroundColor='white'
                        flexDirection='column'
                        justifyContent='flex-end'
                        alignItems='flex-start'
                        overflow='hidden'
                    >
                        {/* Messages container - improved for scrolling */}
                        <Flex
                            alignSelf='stretch'
                            flexDirection='column'
                            justifyContent='flex-end'
                            flex='1'
                            width='100%'
                            overflow='hidden'
                        >
                            <Flex
                                padding={4}
                                backgroundColor='white'
                                flexDirection='column'
                                justifyContent='flex-start'
                                alignItems='flex-start'
                                flex='1'
                                overflow='auto'
                                css={{
                                    overflowY: 'auto',
                                    '&::-webkit-scrollbar': { display: 'none' }
                                }}
                            >
                                {/* Messages content */}
                                <Flex
                                    flexDirection='column'
                                    justifyContent='flex-start'
                                    alignItems='flex-start'
                                    gap={5}
                                    alignSelf='stretch'
                                    width='100%'
                                    marginBottom={4}
                                >
                                    {/* Previous Messages will be here */}
                                    {previousMessages.length > 0 && (
                                        <Messages
                                            messages={previousMessages}
                                            sessionId={sessionId}
                                            sendMessage={sendMessage}
                                            hiddenContextualChips={hiddenContextualChips}
                                            onContextualChipClick={handleContextualChipClick}
                                            latestContextualChipIndex={latestContextualChipIndex}
                                            isLoading={false}
                                            isPrevious={true}
                                            showFeedbackInMessages={showFeedbackInMessages}
                                            feedbackSteps={config?.feedback_steps}
                                            onCloseFeedback={handleCloseFeedback}
                                        />
                                    )}

                                    <ContextualDivider
                                        label={
                                            entryPointData?.entrypoint === ENTRYPOINTS.PLP ? nthCategoryName : `${productBrandName} - ${productName}`
                                        }
                                    />

                                    {prompts?.length > 0 && (
                                        <PreSelectedPrompts
                                            prompts={prompts}
                                            sendMessage={sendMessage}
                                        />
                                    )}
                                    {!isLoadingPrevious && previousMessages.length === 0 && config && <InitialMessages config={config} />}

                                    {/* New Messages */}
                                    <Messages
                                        messages={messages}
                                        sessionId={sessionId}
                                        sendMessage={sendMessage}
                                        hiddenContextualChips={hiddenContextualChips}
                                        onContextualChipClick={handleContextualChipClick}
                                        latestContextualChipIndex={latestContextualChipIndex}
                                        isLoading={isLoading}
                                        showFeedbackInMessages={showFeedbackInMessages}
                                        feedbackSteps={config?.feedback_steps}
                                        onCloseFeedback={handleCloseFeedback}
                                    />

                                    <ErrorMessage
                                        showErrorMessage={showErrorMessage}
                                        text={localization.errorMessage}
                                        resendYourMessage={localization.resendYourMessage}
                                        resendMessage={handleResendMessage}
                                    />
                                </Flex>
                            </Flex>
                            {/* Input area - kept outside the scrollable region */}
                            <InputBar
                                sendMessage={sendMessage}
                                placeholder={localization.placeholder}
                            />
                        </Flex>
                    </Flex>

                    {/* Full-page Share Feedback Overlay */}
                    <SuperChatFlyout
                        isOpen={showFlyer}
                        onShowFeedback={handleShowFeedback}
                    />
                </Flex>
            </Flex>
        </>
    );
}

const styles = {
    superChatContainer: {
        position: 'fixed',
        right: 0,
        bottom: 0,
        width: '100%',
        maxWidth: 420,
        maxHeight: 720,
        height: '100%',
        zIndex: zIndices.flyout,
        [mediaQueries.smMax]: {
            paddingTop: 98
        }
    },
    container: {
        boxShadow: '0px 0px 12px 0px rgba(0, 0, 0, 0.2)',
        borderTopLeft: 4,
        borderTopRight: 4,
        width: '100%',
        borderTopLeftRadius: 6,
        borderTopRightRadius: 6
    },
    backdrop: {
        backgroundColor: 'rgba(0,0,0,.25)',
        transition: 'opacity 300ms',
        display: 'none'
    },
    fixed: {
        position: 'fixed',
        inset: 0,
        zIndex: zIndices.flyout
    }
};

export default wrapFunctionalComponent(SuperChat, 'SuperChat');
