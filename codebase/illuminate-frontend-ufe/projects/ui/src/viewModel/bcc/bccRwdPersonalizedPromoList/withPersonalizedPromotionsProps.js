/* eslint-disable class-methods-use-this */
import { compose } from 'redux';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import pageIdSelector from 'selectors/page/pageIdSelector';
import personalizedPromotionsActions from 'actions/PersonalizedPromotionsActions';
import personalizedPromotionsSelector from 'selectors/personalizedPromotions/personalizedPromotionsSelector';
import PromoListFallback from 'components/Bcc/BccRwdPersonalizedPromoList/PromoListFallback';
import React from 'react';
import { userSelector } from 'selectors/user/userSelector';
import userUtils from 'utils/User';

const { wrapHOC, wrapHOCComponent } = FrameworkUtils;
const withPersonalizedPromotionsProps = compose(
    wrapHOC(
        connect(
            createStructuredSelector({
                user: userSelector,
                personalizedPromotions: personalizedPromotionsSelector,
                pageId: pageIdSelector
            }),
            { loadPersonalizedPromotions: personalizedPromotionsActions.loadPersonalizedPromotions }
        )
    ),
    wrapHOC(WrappedComponent => {
        class PersonalizedPromotionsProps extends React.Component {
            componentDidMount() {
                this.props.loadPersonalizedPromotions();
            }

            componentDidUpdate(prevProps) {
                if (prevProps.user.profileId !== this.props.user.profileId || prevProps.pageId !== this.props.pageId) {
                    this.props.loadPersonalizedPromotions();
                }
            }

            render() {
                const { user, personalizedPromotions, titleText, ...restProps } = this.props;

                const isAnonymous = userUtils.isAnonymous();
                const showLoader =
                    !user.isInitialized || // user not yet initialized
                    user.profileId !== personalizedPromotions.profileId || // data is not for the current user
                    personalizedPromotions.loading; // data is for the current user, but refresh requested (SPA navigation)

                const showFallBack =
                    showLoader || // skeletonScreen
                    isAnonymous || // signInScreen
                    (!showLoader && personalizedPromotions.items?.length === 0); // fallBackScreen

                if (showFallBack) {
                    return (
                        <PromoListFallback
                            isAnonymous={isAnonymous}
                            isSkeleton={showLoader}
                            enablePageRenderTracking={restProps.enablePageRenderTracking}
                        />
                    );
                }

                const personalizedTitle = `${titleText} ${user.firstName} ❤️`;

                const propsToRender = showLoader
                    ? { showSkeleton: true }
                    : {
                        ...restProps,
                        offerCategoryTitle: personalizedTitle,
                        componentList: personalizedPromotions.items,
                        isPersonalizedBeautyOffers: true
                    };

                return <WrappedComponent {...propsToRender} />;
            }
        }

        return wrapHOCComponent(PersonalizedPromotionsProps, 'PersonalizedPromotionsProps', [WrappedComponent]);
    })
);

export default withPersonalizedPromotionsProps;
