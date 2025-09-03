import { wrapFunctionalComponent } from 'utils/framework';
import React, { useEffect, useState } from 'react';
import { Box } from 'components/ui';
import CheckoutCreditCardForm from 'components/FrictionlessCheckout/Payment/CreditCard/CheckoutCreditCardForm';
import orderUtils from 'utils/Order';
import userUtils from 'utils/User';
import { getBillingCountries } from 'components/FrictionlessCheckout/checkoutService/checkoutService';
import CVCInfoModal from 'components/Checkout/Sections/Payment/Section/CVCInfoModal/CVCInfoModal';
import creditCardUtils from 'utils/CreditCard';

// Accept all relevant props from parent
const CreditCardArea = ({
    editStore,
    shippingAddress,
    defaultPayment,
    billingCountries,
    isBopisOrder,
    numberOfSavedCreditCards,
    handleCloseForm,
    callback,
    editCreditCard,
    isEditCCFlow,
    isGuestCheckout,
    commonOrderToggleActions,
    hideCancelButton
}) => {
    const [creditCard, setCreditCard] = useState(null);
    const [isUseShippingAddressAsBilling, setIsUseShippingAddressAsBilling] = useState(false);

    useEffect(() => {
        // For guest users, we always default to using shipping address as billing
        // For existing users, determine based on shipping address or edit mode
        if (isGuestCheckout) {
            setIsUseShippingAddressAsBilling(true);
        } else {
            const isUseShippingAddress = !isEditCCFlow
                ? shippingAddress && shippingAddress.addressType !== orderUtils.SHIPPING_METHOD_TYPES.HAL
                : creditCardUtils.isShipAddressBillingAddress(shippingAddress, editCreditCard?.address);
            setIsUseShippingAddressAsBilling(isUseShippingAddress);
        }
    }, []);

    useEffect(() => {
        getBillingCountries();

        if (editCreditCard && isEditCCFlow) {
            setCreditCard(editCreditCard);
        } else {
            setCreditCard(setAsNewCreditCard());
        }
    }, []);

    const setAsNewCreditCard = () => {
        commonOrderToggleActions();

        return {
            firstName: userUtils.getProfileFirstName() || shippingAddress?.firstName,
            lastName: userUtils.getProfileLastName() || shippingAddress?.lastName,
            address: {
                country: userUtils.getShippingCountry().countryCode
            }
        };
    };

    if (!creditCard) {
        return null;
    }

    return (
        <Box data-at={Sephora.debug.dataAt('credit_cards_area')}>
            <CheckoutCreditCardForm
                editStore={editStore}
                isEditMode={isEditCCFlow}
                creditCard={creditCard}
                defaultPayment={defaultPayment}
                cardType={creditCard && orderUtils.getThirdPartyCreditCard(creditCard)}
                shippingAddress={shippingAddress}
                isUseShippingAddressAsBilling={isUseShippingAddressAsBilling}
                isDefault={creditCard ? creditCard.isDefault : false}
                cancelCallback={handleCloseForm}
                billingCountries={billingCountries}
                isFirstCreditCard={creditCard.cardType ? numberOfSavedCreditCards === 1 : numberOfSavedCreditCards === 0}
                isBopis={isBopisOrder}
                callback={callback}
                hideCancelButton={hideCancelButton}
            />
            <CVCInfoModal />
        </Box>
    );
};

export default wrapFunctionalComponent(CreditCardArea, 'CreditCardArea');
