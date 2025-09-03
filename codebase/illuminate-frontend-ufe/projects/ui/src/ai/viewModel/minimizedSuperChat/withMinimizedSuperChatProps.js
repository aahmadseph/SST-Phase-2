import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { superChatSelector } from 'ai/selectors/superChatSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import SuperChatActions from 'ai/actions/superChatActions';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import sdnApi from 'ai/services/sdn';
import { getGENAISession, setGENAISession } from 'ai/utils/sessionStorage';
import { getAnonymousId } from 'ai/utils/aiBeautyChat';

const { wrapHOC, wrapHOCComponent } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('ai/components/SuperChat/locales', 'SuperChat');

const { previousConversations } = sdnApi;

const localization = createStructuredSelector({
    title: getTextFromResource(getText, 'title')
});

const functions = (dispatch, _ownProps) => ({
    openSuperChat: entryPoint => {
        dispatch(SuperChatActions.showSuperChat(true, [], entryPoint));
    }
});

const fields = createSelector(superChatSelector, localization, coreUserDataSelector, (superChat, locales, user) => {
    return {
        localization: locales,
        user,
        ...superChat
    };
});

const withMinimizedSuperChatProps = compose(
    wrapHOC(connect(fields, functions)),
    wrapHOC(WrappedComponent => {
        class MinimizedSuperChatProps extends React.Component {
            state = {
                session: null
            };

            constructor(props) {
                super(props);
            }

            showMinimizedSuperChat() {
                const session = getGENAISession();
                const anonymousId = getAnonymousId();
                const userBiId = this.props.user?.biId;

                if (session) {
                    this.setState({ session: session });
                }

                if (userBiId) {
                    previousConversations(userBiId, anonymousId)
                        .then(data => {
                            const sessionData = data?.sessions?.at(-1);

                            if (sessionData) {
                                this.setState({ session: sessionData });
                                setGENAISession({
                                    sessionId: sessionData.session_id,
                                    clientId: userBiId,
                                    anonymousId: anonymousId,
                                    ...sessionData
                                });
                            }
                        })
                        .catch(_ => {
                            this.setState({ session: null });
                        });
                }
            }

            componentDidUpdate(prevProps) {
                if (prevProps.showSuperChat !== this.props.showSuperChat) {
                    this.showMinimizedSuperChat();
                }

                if (prevProps.user?.biId !== this.props.user?.biId) {
                    this.showMinimizedSuperChat();
                }
            }

            componentDidMount() {
                this.showMinimizedSuperChat();
            }

            render() {
                const { session } = this.state;

                return (
                    <WrappedComponent
                        {...this.props}
                        session={session}
                    />
                );
            }
        }

        return wrapHOCComponent(MinimizedSuperChatProps, 'MinimizedSuperChatProps', [WrappedComponent]);
    })
);

export {
    withMinimizedSuperChatProps, fields, functions
};
