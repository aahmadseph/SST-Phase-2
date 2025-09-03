import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import OrderUtils from 'utils/Order';
import KlarnaPaymentMethod from 'components/Klarna/KlarnaPaymentMethod';
import KlarnaRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/KlarnaRadio';

const Klarna = ({ isKlarnaEnabledForThisOrder, defaultPayment, handlePaymentClick }) => {
    const { isKlarnaPaymentEnabled } = Sephora.configurationSettings;

    return isKlarnaPaymentEnabled ? (
        <KlarnaRadio
            defaultPayment={defaultPayment}
            disabled={!isKlarnaEnabledForThisOrder}
            fieldsetName='paymentMethodGroup'
            onClick={handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.KLARNA)}
        >
            <KlarnaPaymentMethod isFrictionless />
        </KlarnaRadio>
    ) : null;
};

export default wrapFunctionalComponent(Klarna, 'Klarna');
