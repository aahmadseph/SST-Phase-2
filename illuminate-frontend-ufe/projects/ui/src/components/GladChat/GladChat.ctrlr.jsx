/* eslint-disable class-methods-use-this */
import React, { createRef } from 'react';
import store from 'store/Store';
import FrameworkUtils from 'utils/framework';
import { css, Global } from '@emotion/react';
import { Icon } from 'components/ui';
import scriptUtil from 'utils/LoadScripts';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import mediaUtils from 'utils/Media';
import LanguageLocale from 'utils/LanguageLocale';
import {
    colors, mediaQueries, fontSizes, lineHeights, fontWeights, space, radii
} from 'style/config';
import Storage from 'utils/localStorage/Storage';
import Location from 'utils/Location';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import SuperChatActions from 'ai/actions/superChatActions';
import { CHAT_ENTRY } from 'constants/chat';
import gladApi from 'services/api/gladChat';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import BaseClass from 'components/BaseClass/BaseClass';

const { wrapComponent } = FrameworkUtils;
const { Media } = mediaUtils;
const { getLocaleResourceFile } = LanguageLocale;

const getText = getLocaleResourceFile('components/GladChat/ChatButton/locales', 'ChatButton');
class GladChat extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            unreadMessage: 0,
            isHandleShowClicked: false
        };
        this.gladRef = createRef();
        this.conversationTimeout = null;
    }

    componentDidMount() {
        const { isChatOpen = false, conversationEnd, unreadMessage } = this.getStorageItem(LOCAL_STORAGE.GLADLY_CHAT);

        if (unreadMessage) {
            this.setState({ unreadMessage });
        }

        if (!window.Gladly) {
            scriptUtil.loadScripts(['/js/ufe/isomorphic/thirdparty/gladchat.js'], () => {
                const { appId, appIdCAFR } = Sephora.configurationSettings.gladChatConfig;
                const isFrench = localeUtils.isFrench();
                const selectedAppId = isFrench ? appIdCAFR : appId;

                if (window.Gladly && selectedAppId) {
                    this.initializeGladChat(selectedAppId, isChatOpen, conversationEnd);
                }
            });
        }

        window.addEventListener('popstate', this.handleClose);
    }

    componentWillUnmount() {
        window.removeEventListener('popstate', this.handleClose);
    }

    getStorageItem = key => {
        return Storage.local?.getItem(key) || {};
    };

    setStorageItem = (value, key) => {
        const gladChat = this.getStorageItem(key);
        Storage.local.setItem(key, { ...gladChat, ...value });
    };

    fireAnalytics = (eventData, callType) => {
        processEvent.process(callType, {
            data: eventData
        });
    };

    afterInitilizeGladChat = () => {
        store.setAndWatch('gladChat', this, data => {
            const current = this.getStorageItem(LOCAL_STORAGE.GLADLY_CHAT);

            if (data.gladChat.clickPage) {
                let eventData = null;
                let callType = null;

                switch (data.gladChat.clickPage) {
                    case CHAT_ENTRY.footer:
                        eventData = {
                            pageName: `${anaConsts.PAGE_NAMES.GLAD_FOOTER_PAGE}:n/a:*`,
                            eventStrings: [anaConsts.Event.EVENT_220],
                            linkData: anaConsts.LinkData.CUSTOMER_CHAT_SESSION_STARTED,
                            navigationInfo: `toolbar nav:${anaConsts.PAGE_DETAIL.GLAD_PAGE}: ${anaConsts.PAGE_DETAIL.GLAD_PAGE}: ${anaConsts.PAGE_DETAIL.GLAD_PAGE}: ${anaConsts.PAGE_DETAIL.GLAD_PAGE}`
                        };
                        callType = anaConsts.ASYNC_PAGE_LOAD;

                        break;
                    case CHAT_ENTRY.customerService:
                        eventData = {
                            pageName: `${anaConsts.PAGE_NAMES.GLAD_FOOTER_PAGE}:n/a:*`,
                            eventStrings: [anaConsts.Event.EVENT_220],
                            linkData: anaConsts.LinkData.CUSTOMER_CHAT_SESSION_STARTED
                        };
                        callType = anaConsts.ASYNC_PAGE_LOAD;

                        break;
                    default:
                        break;
                }

                if (eventData) {
                    this.fireAnalytics(eventData, callType);
                }
            }

            if (data.gladChat.entryFlag) {
                this.handleShow();
            }

            if (data.gladChat.isChatOpen) {
                !current?.isChatOpen && this.setStorageItem({ isChatOpen: true }, LOCAL_STORAGE.GLADLY_CHAT);
                this.minimizedButtonsPosition(true);
            } else {
                this.minimizedButtonsPosition(false);
            }
        });
        store.setAndWatch('page', this, data => {
            const {
                page: { showLoadSpaPageProgress }
            } = data;
            const element = this.gladRef.current;

            if (!showLoadSpaPageProgress) {
                const isBasketPage = Location.isBasketPage();
                const height = this.basketCheckoutHeightSmui(isBasketPage);
                element.style.setProperty('--custom-bottom-offset', `calc(var(--bottomNavHeight, 0px) + ${height + space[3]}px)`);
                element.classList.add('chatButtonBasket');
                this.minimizedButtonsPosition(this.props.isChatOpen);
            }
        });

        store.setAndWatch('user.login', this, ({ login }) => {
            const selectedAppId = localeUtils.isFrench()
                ? Sephora.configurationSettings.gladChatConfig?.appIdCAFR
                : Sephora.configurationSettings.gladChatConfig?.appId;
            const data = JSON.parse(localStorage.getItem(selectedAppId) || '{}');
            (data?.values?.isMinimized === false || !login) && this.validateUserAndSet();
        });

        if (Sephora.configurationSettings.isGenAIChatEnabledUFE) {
            store.setAndWatch('superChat.showSuperChat', this, ({ showSuperChat }) => {
                if (showSuperChat) {
                    this.handleClose();
                }
            });
        }

        try {
            Gladly?.on('conversation:started', started => {
                if (started) {
                    clearTimeout(this.conversationTimeout);
                    this.conversationTimeout = null;
                    this.setStorageItem({ conversationEnd: null }, LOCAL_STORAGE.GLADLY_CHAT);
                }
            });

            Gladly?.on('conversation:ended', ended => {
                if (ended) {
                    const conversationEnd = Date.now();
                    this.setStorageItem({ conversationEnd }, LOCAL_STORAGE.GLADLY_CHAT);
                    this.timeOutHandler(conversationEnd);

                    if (this.gladRef.current?.classList?.contains('gladly-show')) {
                        const unreadMessage = this.state.unreadMessage + 1;
                        this.setState({
                            unreadMessage
                        });
                        this.setStorageItem({ unreadMessage }, LOCAL_STORAGE.GLADLY_CHAT);
                    }

                    this.fireAnalytics(
                        {
                            actionInfo: anaConsts.LinkData.CUSTOMER_CHAT_SESSION_ENDED,
                            eventStrings: [anaConsts.Event.EVENT_221]
                        },
                        anaConsts.LINK_TRACKING_EVENT
                    );
                }
            });

            Gladly?.on('message:received', msg => {
                if (msg && this.gladRef.current?.classList?.contains('gladly-show')) {
                    const unreadMessage = this.state.unreadMessage + 1;
                    this.setState({
                        unreadMessage
                    });
                    this.setStorageItem({ unreadMessage }, LOCAL_STORAGE.GLADLY_CHAT);
                }
            });
        } catch (error) {
            Sephora.logger.error('Gladly_Events_Failed:', error);
        }
    };

    timeOutHandler = conversationEnd => {
        if (!this.conversationTimeout) {
            const diff = Date.now() - conversationEnd;
            const { timer = 0 } = Sephora.configurationSettings.gladChatConfig || {};
            const TIMER = timer * 60 * 1000;
            const remainingTimer = diff > TIMER ? 0 : TIMER - diff;
            this.conversationTimeout = setTimeout(async () => {
                await this.handleClear();
                this.setStorageItem({ conversationEnd: null, unreadMessage: 0 }, LOCAL_STORAGE.GLADLY_CHAT);
                this.validateUserAndSet();
            }, remainingTimer);
        }
    };

    validateUserAndSet = async () => {
        try {
            const login = userUtils.getProfileEmail();
            const firstName = userUtils.getProfileFirstName();

            let gladlyUser = Gladly?.getUser();
            let current = this.getStorageItem(LOCAL_STORAGE.GLADLY_CHAT);

            if (!login && current?.userAuth) {
                await this.handleClear();
                this.handleClose();
                this.props.updateGladChatState({ isChatOpen: false });
                this.setStorageItem(
                    {
                        userAuth: null,
                        isChatOpen: false,
                        conversationEnd: null,
                        unreadMessage: 0,
                        gladToken: null
                    },
                    LOCAL_STORAGE.GLADLY_CHAT
                );
            }

            if (firstName && login && !userUtils.isAnonymous()) {
                if (gladlyUser?.identity && gladlyUser?.identity !== login) {
                    await this.handleClear();
                    this.setStorageItem({ gladToken: null }, LOCAL_STORAGE.GLADLY_CHAT);
                }

                gladlyUser = Gladly?.getUser();
                current = this.getStorageItem(LOCAL_STORAGE.GLADLY_CHAT);

                if (!Sephora.configurationSettings.gladChatConfig?.jwtVerification) {
                    this.handleSetUser(firstName, login, gladlyUser?.identity);
                } else {
                    if (gladlyUser?.type === CHAT_ENTRY.authenticate && !userUtils.isSignedIn()) {
                        await this.handleClear();
                        this.handleSetUser(firstName, login);
                    } else if (!gladlyUser) {
                        let token = current?.gladToken;
                        try {
                            if (!token) {
                                const biId = userUtils.getBiAccountId();
                                ({ token } = await gladApi.getGladlyToken(biId));
                                this.setStorageItem({ gladToken: token }, LOCAL_STORAGE.GLADLY_CHAT);
                            }

                            Gladly?.setUser({
                                name: firstName,
                                jwt: token
                            });
                        } catch (error) {
                            this.handleSetUser(firstName, login);
                            Sephora.logger.error('Gladly_Identity_API:/generateToken:', error);
                        }
                    }
                }

                this.setStorageItem({ userAuth: login }, LOCAL_STORAGE.GLADLY_CHAT);
            }
        } catch (error) {
            Sephora.logger.error('Gladly_User_Failed:', error);
        } finally {
            this.setState({
                isHandleShowClicked: false
            });
        }
    };

    initializeGladChat = (appId, isChatOpen, conversationEnd) => {
        Gladly?.init({
            appId
        })
            .then(() => {
                this.afterInitilizeGladChat();
                this.props.updateGladChatState({ isChatOpen });

                if (!isChatOpen) {
                    this.handleClose();
                }

                if (conversationEnd) {
                    this.timeOutHandler(conversationEnd);
                }
            })
            .catch(function (error) {
                Sephora.logger.error('Gladly_Initialize_Failed:', error);
            });
    };

    handleSetUser = (firstName, email, identity = false) => {
        !identity &&
            Gladly?.setUser({
                name: firstName,
                email: email
            });
    };

    handleClear = async () => {
        try {
            await Gladly?.clearUser();
        } catch (error) {
            Sephora.logger.error('Gladly_ClearUser_Failed:', error);
        }
    };

    handleClose = () => {
        if (window.Gladly) {
            try {
                Gladly?.close();
            } catch (error) {
                Sephora.logger.error('Gladly_Close_Failed:', error);
            }
        } else {
            Sephora.logger.error('Gladly_Is_Not_Available_On_Window');
        }
    };

    handleShow = () => {
        if (this.state.isHandleShowClicked) {
            return;
        }

        if (window.Gladly) {
            try {
                this.setState({
                    unreadMessage: 0,
                    isHandleShowClicked: true
                });
                Gladly?.show();
                this.validateUserAndSet();
                this.setStorageItem({ unreadMessage: 0 }, LOCAL_STORAGE.GLADLY_CHAT);
                Sephora.configurationSettings.isGenAIChatEnabledUFE && store.dispatch(SuperChatActions.showSuperChat(false));
            } catch (error) {
                Sephora.logger.error('Gladly_Show_Failed:', error);
            }
        } else {
            Sephora.logger.error('Gladly_Is_Not_Available_On_Window');
        }
    };

    minimizeButtonAction = () => {
        this.handleShow();
        this.fireAnalytics(
            {
                pageName: `${anaConsts.PAGE_NAMES.GLAD_FOOTER_PAGE}:n/a:*`,
                linkData: anaConsts.LinkData.CUSTOMER_CHAT_SESSION_RESUME //prop55
            },
            anaConsts.ASYNC_PAGE_LOAD
        );
    };

    basketCheckoutHeightSmui = isBasketPage => {
        const dataHeightKey = isBasketPage ? 'bottomCostsummaryHeight' : 'bottomStickyHeight';

        return document.body.querySelector(`[data-height="${dataHeightKey}"]`)?.clientHeight || 0;
    };

    minimizedButtonsPosition = isOpen => {
        const gladlyButton = this.gladRef.current;
        const multiChatActive = gladlyButton.parentElement;

        if (Sephora.configurationSettings.isGenAIChatEnabledUFE && isOpen && this.gladRef.current) {
            const bottom = getComputedStyle(gladlyButton).bottom;
            const height = gladlyButton.offsetHeight;

            multiChatActive?.style.setProperty('--multichatActive-bottom', bottom);
            multiChatActive?.style.setProperty('--multichatActive-height', `${height}px`);
        } else {
            multiChatActive?.style.removeProperty('--multichatActive-bottom');
            multiChatActive?.style.removeProperty('--multichatActive-height');
        }
    };

    render() {
        const { unreadMessage } = this.state;
        const { isChatOpen } = this.props;
        const btnLabel = getText('buttonLabel');
        const globalStyles = css`
            #custom-gladly-chat-button.gladly-show {
                visibility: visible;
            }
            .chatButtonBasket {
                bottom: var(--custom-bottom-offset) !important;
            }
            ${mediaQueries.md} {
                .chatButtonBasket {
                    bottom: ${space[3]}px !important;
                }
            }
            .multi-chat-active {
                bottom: calc(var(--multichatActive-bottom, 0px) + var(--multichatActive-height, 0px) + 8px) !important;
            }
        `;

        return (
            <>
                <Global styles={globalStyles} />
                <button
                    id='custom-gladly-chat-button'
                    onClick={this.minimizeButtonAction}
                    css={[styles.chatButton, !isChatOpen && styles.chatButtonHide]}
                    ref={this.gladRef}
                >
                    <div css={[styles.chatBox]}>
                        <Media lessThan='md'>
                            {unreadMessage > 0 ? <div css={styles.redBox}>{unreadMessage}</div> : null}
                            <Icon
                                name='gladChat'
                                size={26}
                            />
                        </Media>
                        <Media
                            greaterThan='md'
                            css={[styles.labelContent]}
                        >
                            {unreadMessage > 0 ? <div css={styles.redBox}></div> : null}
                            <Icon
                                name='gladChat'
                                size={24}
                            />
                            <span css={styles.chatLabel}>{btnLabel}</span>
                            <Icon
                                name={'caretUp'}
                                size={24}
                            />
                        </Media>
                    </div>
                </button>
            </>
        );
    }
}

const styles = {
    chatButton: {
        position: 'fixed',
        visibility: 'hidden',
        flexDirection: 'column',
        alignItems: 'flex-start',
        right: space[3],
        backgroundColor: colors.black,
        color: colors.white,
        bottom: `calc(var(--bottomNavHeight, 0px) + ${space[3]}px)`,
        borderRadius: radii.full,
        zIndex: 1,
        width: 48,
        height: 48,
        [mediaQueries.md]: {
            padding: `${space[3]}px ${space[4]}px`,
            bottom: space[3],
            width: 258
        }
    },
    chatButtonHide: {
        visibility: 'hidden !important'
    },
    labelContent: {
        display: 'flex',
        alignItems: 'center',
        width: '100%',
        gap: space[2]
    },
    chatBox: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        [mediaQueries.md]: {
            justifyContent: 'unset'
        }
    },
    chatLabel: {
        textAlign: 'center',
        fontSize: fontSizes.md,
        fontWeight: fontWeights.bold,
        lineHeight: lineHeights.tight,
        marginRight: 'auto'
    },
    redBox: {
        width: 20,
        height: 20,
        backgroundColor: colors.red,
        borderRadius: radii.full,
        position: 'absolute',
        justifyContent: 'center',
        top: space[1],
        left: space[5],
        zIndex: 1,
        display: 'flex',
        alignItems: 'center',
        fontSize: fontSizes.sm,
        fontWeight: fontWeights.bold
    }
};

export default wrapComponent(GladChat, 'GladChat');
