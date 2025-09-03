/* eslint-disable camelcase */
import React from 'react';
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';

// Selectors
import { superChatSelector } from 'ai/selectors/superChatSelector';
import { pageSelector } from 'selectors/page/pageSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import modalsSelector from 'selectors/modals/modalsSelector';

// Services
import sdnApi from 'ai/services/sdn';

// Actions
import SuperChatActions from 'ai/actions/superChatActions';

// Utils
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { getSuperChatConfig, setSuperChatConfig } from 'ai/utils/sessionStorage';
import { getGENAIAnonymousId } from 'ai/utils/sessionStorage';

// Constants
import { INTENTIONS, ENTRYPOINTS } from 'ai/constants/superchat';
import { CATEGORIES } from 'ai/constants/categories';

const { wrapHOC, wrapHOCComponent } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile, getCurrentLanguage, getCurrentCountry } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('ai/components/SuperChat/locales', 'SuperChat');
const country = getCurrentCountry();
const language = getCurrentLanguage();

const { managerSession, superChatConfig, previousConversations } = sdnApi;

const localization = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    placeholder: getTextFromResource(getText, 'placeholder'),
    errorMessage: getTextFromResource(getText, 'errorMessage'),
    resendYourMessage: getTextFromResource(getText, 'resendYourMessage'),
    lookingForAGift: getTextFromResource(getText, 'lookingForAGift')
});

const functions = (dispatch, _ownProps) => ({
    createSession: async sessionFound => {
        return managerSession(sessionFound).then(data => data);
    },
    closeSuperChat: () => {
        dispatch(SuperChatActions.showSuperChat(false));
    },
    fetchPreviousConversations: (clientId, anonymousId) => {
        return previousConversations(clientId, anonymousId)
            .then(data => data)
            .catch(_ => []);
    },
    storeSuperChatConfig: config => {
        dispatch(SuperChatActions.superChatConfig(config));
    },
    openSuperChatFromGiftFinder: (prompt, defaultPrompt) => {
        const data = {
            entrypoint: ENTRYPOINTS.PLP,
            category_id: CATEGORIES.GIFT,
            selectedPrompt: prompt || defaultPrompt
        };

        dispatch(SuperChatActions.showSuperChat(true, [], data));
    }
});

const fields = createSelector(
    superChatSelector,
    coreUserDataSelector,
    localization,
    pageSelector,
    modalsSelector,
    (superChat, user, locales, page, modals) => {
        const clientId = user?.biId;
        let anonymousId = undefined;
        const isSignInModalOpen = modals?.showSignInModal || modals?.showSignInWithMessagingModal || modals?.showAuthenticateModal;

        if (!Sephora.isNodeRender) {
            anonymousId = getGENAIAnonymousId();
        }

        return {
            localization: locales,
            clientId,
            isSignInModalOpen,
            anonymousId,
            productBrandName: page?.product?.productDetails?.brand?.displayName,
            productName: page?.product?.productDetails?.displayName,
            nthCategoryName: page?.nthCategory?.displayName,
            ...superChat
        };
    }
);

const withSuperChatProps = compose(
    wrapHOC(connect(fields, functions)),
    wrapHOC(WrappedComponent => {
        class SuperChatProps extends React.Component {
            state = {
                config: null
            };

            componentDidMount() {
                const { clientId, anonymousId, openSuperChatFromGiftFinder } = this.props;
                const superChatConfigCached = getSuperChatConfig();
                const urlParams = new URLSearchParams(window.location.search);
                const intention = urlParams.get('intention');
                const prompt = urlParams.get('prompt');

                if (Sephora.configurationSettings.isGenAIGiftFinderEnabled) {
                    if (intention === INTENTIONS.GIFT_FINDER) {
                        openSuperChatFromGiftFinder(prompt, this.props.localization?.lookingForAGift);
                    }
                }

                if (superChatConfigCached) {
                    this.setState({ config: superChatConfigCached });
                    this.props.storeSuperChatConfig(superChatConfigCached);

                    return;
                }

                superChatConfig(language, country, clientId, anonymousId).then(data => {
                    setSuperChatConfig(data?.data?.config);
                    this.props.storeSuperChatConfig(data?.data?.config);
                    this.setState({ config: data?.data?.config });
                });
            }

            render() {
                const { config } = this.state;

                return (
                    <WrappedComponent
                        {...this.props}
                        config={config}
                        language={language}
                        country={country}
                    />
                );
            }
        }

        return wrapHOCComponent(SuperChatProps, 'SuperChatProps', [WrappedComponent]);
    })
);

export {
    withSuperChatProps, fields, functions
};
