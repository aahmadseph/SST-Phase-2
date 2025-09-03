import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import localeUtils from 'utils/LanguageLocale';
import BaseClass from 'components/BaseClass';
import UrlUtils from 'utils/Url';
import DateUtils from 'utils/Date';
import storeUtils from 'utils/Store';
import sdnApi from 'services/api/sdn';
import Modal from 'components/Modal/Modal';
import orderDetailsBindings from 'analytics/bindingMethods/pages/orderDetails/orderDetailsBindings';
import CurbsidePickupLandingScreen from 'pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/screens/CurbsidePickupLandingScreen';
import CurbsidePickupCheckingScreen from 'pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/screens/CurbsidePickupCheckinScreen';
import CurbsidePickupBarcodeScreen from 'pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/screens/CurbsidePickupBarcodeScreen';
import CurbsidePickupStoreClosedScreen from 'pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/screens/CurbsidePickupStoreClosedScreen';
import CurbsideNotAvailableScreen from 'pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/screens/CurbsideNotAvailableScreen';

const getText = localeUtils.getLocaleResourceFile(
    'pages/Community/RichProfile/MyAccount/CurbsidePickupCheckinModal/locales',
    'CurbsidePickupCheckinModal'
);

class CurbsidePickupCheckinModalRouter extends BaseClass {
    state = {
        activeScreenIndex: 0,
        loading: false
    };

    goToNextScreen = () => {
        if (this.state.activeScreenIndex < 2) {
            this.setState(
                ({ activeScreenIndex }) => ({ activeScreenIndex: activeScreenIndex + 1 }),
                () => {
                    if (this.state.activeScreenIndex === 1) {
                        this.processAnalytics(orderDetailsBindings.STORE_STATUSES.OPEN);
                    }
                }
            );
        }
    };

    processAnalytics = storeStatus => {
        orderDetailsBindings.curbsidePickupCheckInModal({ storeStatus, activeScreenIndex: this.state.activeScreenIndex });
    };

    dismissModal = () => {
        this.props.showCurbsidePickupCheckinModal({ isOpen: false });
    };

    notifyStore = formData => {
        this.setState({ loading: true });

        // Format current time to something like 09:20AM
        const currentDate = new Date();
        let hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const arrivalTime = `${('0' + hours).substr(-2)}:${('0' + minutes).substr(-2)}${ampm}`;

        const body = {
            storeId: this.props.storeDetails.storeId,
            messageDetails: {
                ...formData,
                arrivalTime,
                orderId: UrlUtils.getUrlLastFragment(),
                isMultipleOrders: formData.isMultipleOrders ? 'YES' : 'NO'
            },
            submitRequestTime: DateUtils.formatAsISO8601WTz(currentDate)
        };

        // Promise resolves with error, either null or Error or { errorCode, errorMessages }
        return sdnApi
            .notifyCurbsidePickup(UrlUtils.getUrlLastFragment(), body)
            .then(response => response)
            .catch(e => e)
            .finally(() => this.setState({ loading: false }));
    };

    render() {
        const { storeDetails, isCurbsideAvailable } = this.props;
        const orderId = UrlUtils.getUrlLastFragment();
        const todayStoreStatus = storeUtils.getTodayStoreStatus(storeDetails);
        const isCurbsideAvailableNow = storeUtils.isCurbsideAvailable(todayStoreStatus);
        let content = null;

        orderDetailsBindings.hereForCurbsideClick({ orderId });

        if (isCurbsideAvailable) {
            if (!isCurbsideAvailableNow || !todayStoreStatus.curbsideHours) {
                this.processAnalytics(orderDetailsBindings.STORE_STATUSES.CLOSED);
                content = (
                    <CurbsidePickupStoreClosedScreen
                        dismissModal={this.dismissModal}
                        storeDetails={storeDetails}
                    />
                );
            } else {
                switch (this.state.activeScreenIndex) {
                    case 0:
                        this.processAnalytics(orderDetailsBindings.STORE_STATUSES.OPEN);
                        content = (
                            <CurbsidePickupLandingScreen
                                goToNextScreen={this.goToNextScreen}
                                storeDetails={storeDetails}
                            />
                        );

                        break;
                    case 1:
                        content = (
                            <CurbsidePickupCheckingScreen
                                goToNextScreen={this.goToNextScreen}
                                notifyStore={this.notifyStore}
                                disabled={this.state.loading}
                                storeDetails={storeDetails}
                            />
                        );

                        break;
                    case 2:
                        content = (
                            <CurbsidePickupBarcodeScreen
                                dismissModal={this.dismissModal}
                                storeDetails={storeDetails}
                                orderId={orderId}
                            />
                        );

                        break;
                    default:
                }
            }
        } else {
            this.processAnalytics(orderDetailsBindings.STORE_STATUSES.UNAVAILABLE);
            content = <CurbsideNotAvailableScreen dismissModal={this.dismissModal} />;
        }

        return (
            <Modal
                width={0}
                isOpen
                onDismiss={this.dismissModal}
                hasBodyScroll={true}
            >
                <Modal.Header>
                    <Modal.Title>{getText('title')}</Modal.Title>
                </Modal.Header>
                {content}
            </Modal>
        );
    }
}

export default wrapComponent(CurbsidePickupCheckinModalRouter, 'CurbsidePickupCheckinModalRouter');
