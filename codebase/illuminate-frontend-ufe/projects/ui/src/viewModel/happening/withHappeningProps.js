import React from 'react';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { createSelector } from 'reselect';

import HappeningActions from 'actions/HappeningActions';
import HappeningBindings from 'analytics/bindingMethods/components/Content/Happening/HappeningBindings';

import Loader from 'components/Loader/Loader';

import { preferredStoreIdSelector } from 'selectors/user/preferredStoreIdSelector';
import happeningSelector from 'selectors/page/happening/happeningSelector';
import { happeningUserDataSelector } from 'selectors/page/happening/happeningUserDataSelector';

import framework from 'utils/framework';
import withLocationInfo from 'utils/HappeningLocation';
import JavascriptUtils from 'utils/javascript';
import locationUtils from 'utils/Location';

const { wrapHOC, wrapHOCComponent } = framework;
const { isObjectEmpty } = JavascriptUtils;
const {
    getEventEDPCSC,
    getLandingPagesCSC,
    getApptConfirmationCSC,
    getWaitlistConfirmationCSC,
    getWaitlistReservationCSC,
    getApptDetailsCSC,
    getSeasonalCSC
} = HappeningActions;

const fields = createSelector(happeningSelector, preferredStoreIdSelector, happeningUserDataSelector, (happeningContent, preferredStore, user) => ({
    ...happeningContent,
    preferredStore,
    user
}));

const functions = {
    getLandingPagesCSC,
    getEventEDPCSC,
    getApptConfirmationCSC,
    getWaitlistConfirmationCSC,
    getWaitlistReservationCSC,
    getApptDetailsCSC,
    getSeasonalCSC
};

const withHappeningProps = compose(
    wrapHOC(connect(fields, functions)),
    wrapHOC(WrappedComponent => {
        class HappeningProps extends React.Component {
            constructor(props) {
                super(props);

                this.state = {
                    storeId: undefined,
                    storeZipCode: undefined
                };
            }

            isRSVPConfirmationPage = () => locationUtils.isRSVPConfirmationPage();

            isBookingConfirmationPage = () => locationUtils.isBookingConfirmationPage();

            isWaitlistConfirmationPage = () => locationUtils.isWaitlistConfirmationPage();

            isWaitlistReservationPage = () => locationUtils.isWaitlistReservationPage();

            isLandingPage = () => locationUtils.isServiceLandingPage() || locationUtils.isEventsLandingPage();

            isEventDetailsPage = () => locationUtils.isEventDetailsPage();

            isHappeningCSPage = () => {
                return (
                    locationUtils.isServiceLandingPage() ||
                    locationUtils.isEventsLandingPage() ||
                    locationUtils.isEventDetailsPage() ||
                    locationUtils.isReservationDetailsPage()
                );
            };

            isReservationDetailsPage = () => locationUtils.isReservationDetailsPage();

            isSeasonalPage = () => locationUtils.isSeasonalPage();

            firePageLoadAnalytics = () => {
                if (this.isSeasonalPage()) {
                    HappeningBindings.seasonalPageLoadAnalytics();
                }
            };

            updateClientSideContent = (storeId, storeZipCode, sephoraStores = []) => {
                this.setState({ storeId, storeZipCode }, () => {
                    if (this.isRSVPConfirmationPage()) {
                        this.props.getApptConfirmationCSC(storeZipCode);
                    } else if (this.isLandingPage()) {
                        this.props.getLandingPagesCSC({
                            preferredStoreId: storeId,
                            preferredZipCode: storeZipCode,
                            sephoraStores
                        });
                    } else if (this.isSeasonalPage()) {
                        this.props.getSeasonalCSC(storeZipCode);
                    }
                });
            };

            componentDidMount() {
                const { isInitialized, user } = this.props;

                if (!isInitialized && this.isEventDetailsPage()) {
                    this.props.getEventEDPCSC(user);
                }

                if (!isInitialized && this.isBookingConfirmationPage()) {
                    this.props.getApptConfirmationCSC();
                }

                if (!isInitialized && this.isWaitlistConfirmationPage()) {
                    this.props.getWaitlistConfirmationCSC();
                }

                if (!isInitialized && this.isWaitlistReservationPage()) {
                    this.props.getWaitlistReservationCSC();
                }

                if (!isInitialized && (this.isLandingPage() || this.isRSVPConfirmationPage() || this.isSeasonalPage())) {
                    withLocationInfo(this.updateClientSideContent, this.state);
                }

                if (this.isReservationDetailsPage() && !isInitialized) {
                    this.props.getApptDetailsCSC();
                }

                this.firePageLoadAnalytics();
            }

            componentDidUpdate(prevProps) {
                const { content, isInitialized, preferredStore, user } = this.props;
                const isContentChanged = content !== prevProps.content;
                const isUserChanged = user.isSignedIn !== prevProps.user.isSignedIn;
                const isPreferredStoreChanged = preferredStore !== prevProps.preferredStore;

                if (!isPreferredStoreChanged && this.isHappeningCSPage() && isInitialized) {
                    return;
                }

                if (this.isEventDetailsPage() && (isContentChanged || isUserChanged)) {
                    this.props.getEventEDPCSC(user);
                }

                if (this.isLandingPage() && isPreferredStoreChanged && isContentChanged) {
                    withLocationInfo(this.updateClientSideContent, this.state);
                }

                if (isContentChanged) {
                    this.firePageLoadAnalytics();
                }
            }

            render() {
                const contentNotReady = isObjectEmpty(this.props.content);

                if (contentNotReady) {
                    return (
                        <Loader
                            isShown={true}
                            isInline={true}
                        />
                    );
                }

                return <WrappedComponent {...this.props} />;
            }
        }

        return wrapHOCComponent(HappeningProps, 'HappeningProps', [WrappedComponent]);
    })
);

export { withHappeningProps };
