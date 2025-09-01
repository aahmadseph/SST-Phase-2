/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import ShipMethodsList from 'components/RwdCheckout/Sections/ShipOptions/ShipMethodsList';
import AccordionButton from 'components/RwdCheckout/AccordionButton';
import ShippingCalculationInfoMessage from 'components/RwdCheckout/Shared/ShippingCalculationInfoMessage';
import Debounce from 'utils/Debounce';
import orderUtils from 'utils/Order';
import Location from 'utils/Location';
import ErrorsUtils from 'utils/Errors';

class GiftCardShipOptionsForm extends BaseClass {
    saveForm = () => {
        const { shippingGroup } = this.props;
        const orderId = orderUtils.getOrderId();
        this.setShippingMethod(shippingGroup, orderId)
            .then(() => {
                this.setGiftMessage(shippingGroup).then(() => {
                    this.props.sectionSaved(Location.getLocation().pathname);
                });
            })
            .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
    };

    saveFormDebounced = Debounce.preventDoubleClick(this.saveForm);

    setShippingMethod = (shippingGroup, orderId) => {
        const checkedShippingMethod = this.giftCardShipMethodsList.getData();
        const shipOptionsSendData = {
            orderId,
            shippingGroupId: shippingGroup.shippingGroupId,
            shippingMethodId: checkedShippingMethod.shippingMethodId
        };

        return this.props.setShippingMethod(shipOptionsSendData);
    };

    setGiftMessage = shippingGroup => {
        const { giftCardMessage } = this.props;

        if (giftCardMessage) {
            // need to delete isDefault and isAddressVerified property from inside address object
            // because otherwise api with throw an error
            // but need to submit on the upper level of the put data becausee otherwise isDefault
            // will get reset to false.
            // @TODO: update data with isAddressVerified on upper level when we implement AVS
            const isDefault = shippingGroup.address.isDefault;
            delete shippingGroup.address.isDefault;
            delete shippingGroup.address.isAddressVerified;
            delete shippingGroup.address.email;
            const data = {
                giftMessage: giftCardMessage,
                shippingGroupId: shippingGroup.shippingGroupId,
                address: shippingGroup.address,
                isDefaultAddress: isDefault
            };

            return this.props.updateShippingAddress(data).catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
        } else {
            return Promise.resolve();
        }
    };

    render() {
        const { allowUpdatedShippingCalculationsMsg, isPhysicalGiftCard } = this.props;

        return (
            <div>
                {allowUpdatedShippingCalculationsMsg && <ShippingCalculationInfoMessage />}
                <ShipMethodsList
                    {...this.props}
                    onRef={comp => (this.giftCardShipMethodsList = comp)}
                    isGiftCardShipDelivery
                    isPhysicalGiftCard={isPhysicalGiftCard}
                />
                <AccordionButton onClick={this.saveFormDebounced} />
            </div>
        );
    }
}

export default wrapComponent(GiftCardShipOptionsForm, 'GiftCardShipOptionsForm');
