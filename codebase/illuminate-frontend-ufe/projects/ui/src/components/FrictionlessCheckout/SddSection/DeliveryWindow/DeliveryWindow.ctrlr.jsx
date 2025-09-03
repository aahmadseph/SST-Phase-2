import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import DeliveryWindowModal from 'components/FrictionlessCheckout/SddSection/DeliveryWindow/DeliveryWindowModal';
import CheckoutApi from 'services/api/checkout';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import DeliveryWindowOption from 'components/FrictionlessCheckout/SddSection/DeliveryWindow/DeliveryWindowOption';
import { Grid } from 'components/ui';

class DeliveryWindow extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {};
    }

    render() {
        const {
            sameDayDeliveryLabel,
            sameDayDeliveryMessage,
            sameDayDeliveryPrice,
            deliveryWindowTitle,
            deliveryWindowPrice,
            deliveryWindowMessage,
            displaySDUDeliveryPrice,
            isScheduledSDDDeliveryEnabled,
            sameDayShippingGroupId,
            scheduledSDDShippingMethodId,
            isDeliveryWindowScheduled,
            isFreeRougeSDD,
            localization
        } = this.props;

        return (
            <>
                <Grid
                    gap={2}
                    marginTop={[0, 4]}
                    marginBottom={4}
                >
                    <DeliveryWindowOption
                        label={sameDayDeliveryLabel}
                        message={sameDayDeliveryMessage}
                        price={sameDayDeliveryPrice}
                        isFreeRougeSDD={isFreeRougeSDD}
                        isActive={!isDeliveryWindowScheduled}
                        onClick={this.setSameDayDelivery}
                        isUserSDUMember={displaySDUDeliveryPrice}
                        localization={localization}
                    />
                    {isScheduledSDDDeliveryEnabled && (
                        <DeliveryWindowOption
                            label={deliveryWindowTitle}
                            message={deliveryWindowMessage}
                            messageColor={isDeliveryWindowScheduled ? 'blue' : ''}
                            price={deliveryWindowPrice}
                            onClick={isScheduledSDDDeliveryEnabled ? this.showScheduledDeliveryWindowModal : null}
                            isDisabled={!isScheduledSDDDeliveryEnabled}
                            isActive={isDeliveryWindowScheduled}
                            localization={localization}
                        />
                    )}
                </Grid>
                {this.state.showDeliveryWindowModal && (
                    <DeliveryWindowModal
                        onCloseCallback={this.onClose}
                        successCallback={this.onScheduleDeliveryWindow}
                        sameDaySchedules={this.state.sameDaySchedules}
                        deliveryWindowPrice={deliveryWindowPrice}
                        deliveryWindowTitle={deliveryWindowTitle}
                        sameDayShippingGroupId={sameDayShippingGroupId}
                        schedulingError={this.state.schedulingError}
                        scheduledSDDShippingMethodId={scheduledSDDShippingMethodId}
                    />
                )}
            </>
        );
    }

    setSameDayDelivery = () => {
        const shipMethodData = {
            orderId: 'current',
            shippingGroupId: this.props.sameDayShippingGroupId,
            shippingMethodId: this.props.sameDayDeliveryMethodId
        };

        this.props.setShippingMethod(shipMethodData, this.fireAnalytics, this.onScheduleDeliveryWindow, this.onClose);
    };

    showScheduledDeliveryWindowModal = () => {
        CheckoutApi.getSamedaySchedules('current')
            .then(data => {
                this.fireAnalytics();
                this.setState({
                    showDeliveryWindowModal: true,
                    sameDaySchedules: data.schedules,
                    schedulingError: null
                });
            })
            .catch(e => {
                this.setState({
                    showDeliveryWindowModal: true,
                    schedulingError: e.errorMessages[0]
                });
            });
    };

    fireAnalytics = () => {
        const pageType = anaConsts.PAGE_NAMES.SAME_DAY_DELIVERY;
        const pageDetail = anaConsts.PAGE_TYPES.SAME_DAY_TIME_SELECTOR;
        const eventData = {
            pageName: `${pageType}:${pageDetail}:n/a:*`,
            pageType: pageType,
            pageDetail: pageDetail,
            linkData: anaConsts.LinkData.SAME_DAY_TIME_SELECTOR_OPEN
        };
        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, { data: eventData });
    };

    onClose = e => {
        this.setState({ showDeliveryWindowModal: false });
        this.props.showInfoModal({
            isOpen: true,
            title: this.props.localization.errorTitle,
            message: e.errorMessages[0],
            buttonText: this.props.localization.ok,
            isHtml: true
        });
    };

    onScheduleDeliveryWindow = () => {
        this.setState({
            showDeliveryWindowModal: false
        });
        this.props.onDeliveryWindowSaved();
    };
}

DeliveryWindow.defaultProps = {
    deliveryWindowTitle: ''
};
DeliveryWindow.propTypes = {
    deliveryWindowTitle: PropTypes.string.isRequired,
    sameDayDeliveryLabel: PropTypes.string.isRequired,
    sameDayDeliveryMessage: PropTypes.string.isRequired,
    sameDayDeliveryPrice: PropTypes.string.isRequired,
    deliveryWindowPrice: PropTypes.string,
    displaySDUDeliveryPrice: PropTypes.bool.isRequired
};

export default wrapComponent(DeliveryWindow, 'DeliveryWindow');
