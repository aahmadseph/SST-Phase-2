import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box } from 'components/ui';
import DeliveryOptions from 'components/ProductPage/DeliveryOptions/DeliveryOptions.ctrlr';
import basketConstants from 'constants/Basket';
import { DELIVERY_OPTION_TYPES } from 'components/GlobalModals/ChooseOptionsModal/constants';

const { DELIVERY_OPTIONS } = basketConstants;

class FulfillmentSection extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            serviceUnavailable: false,
            sameDayNotAvailableForZip: false,
            sameDayAvailable: true
        };

        this.getItShippedClick = this.getItShippedClick.bind(this);
        this.reserveAndPickupClick = this.reserveAndPickupClick.bind(this);
        this.sameDayDeliveryClick = this.sameDayDeliveryClick.bind(this);
        this.autoReplenishClick = this.autoReplenishClick.bind(this);
        this.resetGetItShipped = this.resetGetItShipped.bind(this);
        this.setDeliveryOption = this.setDeliveryOption.bind(this);
    }

    setDeliveryOption(optionType) {
        this.props.onDeliveryOptionChange({
            getItShipped: optionType === DELIVERY_OPTION_TYPES.SHIPPED,
            sameDayDelivery: optionType === DELIVERY_OPTION_TYPES.SAME_DAY,
            reserveAndPickup: optionType === DELIVERY_OPTION_TYPES.PICKUP
        });
    }

    getItShippedClick(sameDayAvailable, isUpdatedZipCode) {
        if (this.props.selectedDeliveryOption === DELIVERY_OPTIONS.STANDARD && !isUpdatedZipCode) {
            return;
        }

        isUpdatedZipCode && this.props.onPreferredStoreOrZipChange(DELIVERY_OPTION_TYPES.SHIPPED);

        this.setDeliveryOption(DELIVERY_OPTION_TYPES.SHIPPED);
    }

    reserveAndPickupClick(isUpdatedStore) {
        if (this.props.selectedDeliveryOption === DELIVERY_OPTIONS.PICKUP && !isUpdatedStore) {
            return;
        }

        isUpdatedStore && this.props.onPreferredStoreOrZipChange(DELIVERY_OPTION_TYPES.PICKUP);

        this.setDeliveryOption(DELIVERY_OPTION_TYPES.PICKUP);
    }

    sameDayDeliveryClick(sameDayAvailable, isUpdatedZipCode) {
        if (this.props.selectedDeliveryOption === DELIVERY_OPTIONS.SAME_DAY && !isUpdatedZipCode) {
            return;
        }

        isUpdatedZipCode && this.props.onPreferredStoreOrZipChange(DELIVERY_OPTION_TYPES.SAME_DAY);
        this.setDeliveryOption(DELIVERY_OPTION_TYPES.SAME_DAY);
        this.setState({
            sameDayAvailable,
            serviceUnavailable: false,
            sameDayNotAvailableForZip: false
        });
    }

    autoReplenishClick() {
        if (this.props.selectedDeliveryOption === DELIVERY_OPTIONS.AUTO_REPLENISH) {
            return;
        }

        this.setDeliveryOption(DELIVERY_OPTION_TYPES.AUTO_REPLENISH);
    }

    resetGetItShipped(callback) {
        this.setDeliveryOption(DELIVERY_OPTION_TYPES.SHIPPED);

        if (callback) {
            callback();
        }
    }

    componentDidMount() {
        this.syncSelectedDeliveryOption();
    }

    syncSelectedDeliveryOption() {
        const { selectedDeliveryOption } = this.props;

        if (!selectedDeliveryOption) {
            return;
        }

        const optionType = this.props.mapDeliveryOptionToType(selectedDeliveryOption);

        if (optionType) {
            this.setDeliveryOption(optionType);
        }
    }

    componentDidUpdate(prevProps) {
        if (prevProps.selectedDeliveryOption !== this.props.selectedDeliveryOption) {
            this.syncSelectedDeliveryOption();
        }
    }

    getFulfillmentOptions() {
        const {
            product,
            currentSku,
            preferredStoreInfo,
            quantity = 1,
            displayOrderCutoffCountdown = false,
            hasPickupMessage = false,
            reorderFulfillmentOptionsPdp = false,
            skuTrialEligibility = false,
            skuTrialPeriod = null,
            isUserSDUTrialEligible = false,
            isSDUAddedToBasket = false,
            shippingMethodNotAvailable = false,
            sddRadioButtonDisabled = false,
            deliveryOptions,
            getItShipped,
            sameDayDelivery,
            reserveAndPickup,
            selectedDeliveryOption,
            triggerModalOpenAnalytics,
            showSignInModal,
            localization: { signInText, forFreeShippingText }
        } = this.props;
        const { serviceUnavailable, sameDayAvailable, sameDayNotAvailableForZip } = this.state;
        const effectiveCurrentSku = currentSku || product?.currentSku;

        const productWithEffectiveSku = {
            ...product,
            currentSku: effectiveCurrentSku
        };

        return (
            <Box
                marginTop={4}
                marginBottom={3}
                data-at='ql-fulfillment-options'
            >
                <DeliveryOptions
                    deliveryOptions={deliveryOptions}
                    sddRadioButtonDisabled={sddRadioButtonDisabled}
                    showBopisSelectorCopyOnPdp={false}
                    hasPickupMessage={hasPickupMessage}
                    signInText={signInText}
                    forFreeShippingText={forFreeShippingText}
                    reorderFulfillmentOptionsPdp={reorderFulfillmentOptionsPdp}
                    displayOrderCutoffCountdown={displayOrderCutoffCountdown}
                    getItShipped={getItShipped}
                    getItShippedClick={this.getItShippedClick}
                    sameDayDelivery={sameDayDelivery}
                    sameDayDeliveryClick={this.sameDayDeliveryClick}
                    serviceUnavailable={serviceUnavailable}
                    sameDayNotAvailableForZip={sameDayNotAvailableForZip}
                    sameDayAvailable={sameDayAvailable}
                    currentProduct={productWithEffectiveSku}
                    currentSkuFromProduct={effectiveCurrentSku}
                    reserveAndPickupClick={this.reserveAndPickupClick}
                    reserveAndPickup={reserveAndPickup}
                    autoReplenishClick={this.autoReplenishClick}
                    quantity={quantity}
                    skuTrialEligibility={skuTrialEligibility}
                    skuTrialPeriod={skuTrialPeriod}
                    isUserSDUTrialEligible={isUserSDUTrialEligible}
                    resetGetItShipped={this.resetGetItShipped}
                    isSDUAddedToBasket={isSDUAddedToBasket}
                    shippingMethodNotAvailable={shippingMethodNotAvailable}
                    preferredStoreInfo={preferredStoreInfo}
                    dynamicColumns={true}
                    showAutoReplenishment={false}
                    fromChooseOptionsModal={true}
                    selectedDeliveryOption={selectedDeliveryOption}
                    triggerModalOpenAnalytics={triggerModalOpenAnalytics}
                    showSignInModal={showSignInModal}
                />
            </Box>
        );
    }

    render() {
        return this.getFulfillmentOptions();
    }
}

FulfillmentSection.propTypes = {
    product: PropTypes.object,
    currentSku: PropTypes.object,
    preferredStoreInfo: PropTypes.object,
    shippingMethodNotAvailable: PropTypes.bool,
    sddRadioButtonDisabled: PropTypes.bool,
    quantity: PropTypes.number,
    displayOrderCutoffCountdown: PropTypes.bool,
    hasPickupMessage: PropTypes.bool,
    reorderFulfillmentOptionsPdp: PropTypes.bool,
    skuTrialEligibility: PropTypes.oneOfType([PropTypes.bool, PropTypes.string]),
    skuTrialPeriod: PropTypes.string,
    isUserSDUTrialEligible: PropTypes.bool,
    isSDUAddedToBasket: PropTypes.bool,
    selectedDeliveryOption: PropTypes.string,
    onDeliveryOptionChange: PropTypes.func
};

FulfillmentSection.defaultProps = {
    product: null,
    currentSku: null,
    preferredStoreInfo: null,
    shippingMethodNotAvailable: false,
    sddRadioButtonDisabled: false,
    quantity: 1,
    displayOrderCutoffCountdown: false,
    hasPickupMessage: false,
    reorderFulfillmentOptionsPdp: false,
    skuTrialEligibility: false,
    skuTrialPeriod: null,
    isUserSDUTrialEligible: false,
    isSDUAddedToBasket: false,
    selectedDeliveryOption: DELIVERY_OPTIONS.STANDARD,
    onDeliveryOptionChange: () => {}
};

export default wrapComponent(FulfillmentSection, 'FulfillmentSection', true);
