/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import ShipMethodsList from 'components/Checkout/Sections/ShipOptions/ShipMethodsList/ShipMethodsList';
import AccordionButton from 'components/Checkout/AccordionButton';
import ShippingCalculationInfoMessage from 'components/Checkout/Shared/ShippingCalculationInfoMessage/ShippingCalculationInfoMessage';
import checkoutApi from 'services/api/checkout';
import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import Debounce from 'utils/Debounce';
import orderUtils from 'utils/Order';
import Location from 'utils/Location';
import FormsUtils from 'utils/Forms';
import ErrorsUtils from 'utils/Errors';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/Checkout/constants';

class GiftCardShipOptionsForm extends BaseClass {
    saveForm = () => {
        const { shippingGroup } = this.props;
        const orderId = orderUtils.getOrderId();
        this.setShippingMethod(shippingGroup, orderId)
            .then(() => {
                this.setGiftMessage(shippingGroup).then(() => {
                    store.dispatch(OrderActions.sectionSaved(Location.getLocation().pathname));
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

        return decorators.withInterstice(checkoutApi.setShippingMethod, INTERSTICE_DELAY_MS)(shipOptionsSendData);
    };

    setGiftMessage = shippingGroup => {
        const giftCardMessage = store.getState().editData[FormsUtils.getStoreEditSectionName(FormsUtils.FORMS.CHECKOUT.GIFT_CARD_MESSAGE)];

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

            return decorators
                .withInterstice(
                    checkoutApi.updateShippingAddress,
                    INTERSTICE_DELAY_MS
                )(data)
                .catch(errorData => ErrorsUtils.collectAndValidateBackEndErrors(errorData, this));
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
                    ref={comp => (this.giftCardShipMethodsList = comp)}
                    isGiftCardShipDelivery
                    isPhysicalGiftCard={isPhysicalGiftCard}
                />
                <AccordionButton onClick={this.saveFormDebounced} />
            </div>
        );
    }
}

export default wrapComponent(GiftCardShipOptionsForm, 'GiftCardShipOptionsForm');
