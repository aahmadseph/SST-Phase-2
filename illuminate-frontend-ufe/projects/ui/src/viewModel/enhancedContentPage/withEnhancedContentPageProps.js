/* eslint-disable class-methods-use-this */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import EnhancedContentSelector from 'selectors/page/enhancedContent/enhancedContentSelector';
import FrameworkUtils from 'utils/framework';
import React from 'react';
import JavascriptUtils from 'utils/javascript';
import { getEnhancedContent } from 'services/api/Content/getEnhancedContent';
import Actions from 'Actions';
import EnhancedContentActions from 'actions/EnhancedContentActions';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import spaUtils from 'utils/Spa';
import urlUtils from 'utils/Url';
import { Pages } from 'constants/Pages';
import biIdSelector from 'selectors/user/beautyInsiderAccount/biIdSelector';
import isInitializedSelector from 'selectors/user/isInitializedSelector';
import gamificationUtils from 'utils/gamificationUtils';
import userUtils from 'utils/User';
import locationUtils from 'utils/Location';

const { isObjectEmpty } = JavascriptUtils;
const { wrapHOC, wrapHOCComponent } = FrameworkUtils;
const { enhancedContentSelector } = EnhancedContentSelector;
const { setEnhancedContentData } = EnhancedContentActions;
const { getCurrentCountry, getCurrentLanguage } = LanguageLocaleUtils;
const { normalizePath } = spaUtils;
const { reload } = locationUtils;
const { redirectTo } = urlUtils;
const { showSignInModal } = Actions;

const withEnhancedContentPageProps = compose(
    wrapHOC(
        connect(
            createStructuredSelector({
                content: enhancedContentSelector,
                userId: biIdSelector,
                isInitialized: isInitializedSelector
            }),
            {
                setEnhancedContentData: data => dispatch => {
                    dispatch(setEnhancedContentData(data));
                },
                showSignInModal: () => dispatch => {
                    dispatch(
                        showSignInModal({
                            isOpen: true,
                            callback: () => reload()
                        })
                    );
                }
            }
        )
    ),
    wrapHOC(WrappedComponent => {
        class EnhancedContentProps extends React.Component {
            componentDidMount() {
                if (!Sephora.configurationSettings.isGamificationEnabled) {
                    redirectTo('/');
                }
            }

            componentDidUpdate(prevProps) {
                if (prevProps.userId !== this.props.userId || (this.props.isInitialized && !this.props.userId && isObjectEmpty(this.props.content))) {
                    this.getEnhancedContent();
                }

                if (isObjectEmpty(this.props.content) && userUtils.isAnonymous() && gamificationUtils.shouldTriggerMedalliaSurvey()) {
                    this.props.showSignInModal();
                }
            }

            getEnhancedContent() {
                const country = getCurrentCountry();
                const language = getCurrentLanguage();
                const path = normalizePath(location.pathname);
                const isAnonymous = userUtils.isAnonymous();

                getEnhancedContent({
                    country,
                    language,
                    path,
                    userId: this.props.userId,
                    isAnonymous
                })
                    .then(response => {
                        if (response.data) {
                            this.props.setEnhancedContentData(response.data);
                        } else {
                            redirectTo(Pages.Error404);
                        }
                    })
                    .catch(() => {
                        if (!gamificationUtils.shouldTriggerMedalliaSurvey()) {
                            redirectTo(Pages.Error404);
                        }
                    });
            }

            render() {
                const isNoContent = isObjectEmpty(this.props.content);

                if (isNoContent) {
                    return null;
                }

                return <WrappedComponent {...this.props} />;
            }
        }

        return wrapHOCComponent(EnhancedContentProps, 'EnhancedContentProps', [WrappedComponent]);
    })
);

export { withEnhancedContentPageProps };
