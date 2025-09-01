import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import OrderUtils from 'utils/Order';
import AfterpayPaymentMethod from 'components/Afterpay/AfterpayPaymentMethod';
import AfterpayRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/AfterpayRadio';

const AfterPay = ({ defaultPayment, handlePaymentClick, isAfterpayEnabledForThisOrder, isAfterpayEnabledForThisProfile }) => {
    const { afterpayEnabled } = Sephora.configurationSettings;

    return afterpayEnabled && isAfterpayEnabledForThisProfile ? (
        <AfterpayRadio
            defaultPayment={defaultPayment}
            disabled={!isAfterpayEnabledForThisOrder}
            onClick={handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.AFTERPAY)}
        >
            <AfterpayPaymentMethod isFrictionless />
        </AfterpayRadio>
    ) : null;
};

export default wrapFunctionalComponent(AfterPay, 'AfterPay');
