import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import OrderUtils from 'utils/Order';
import PazeRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/PazeRadio';
import PazePaymentMethod from 'components/Paze/PazePaymentMethod';
import pazeUtils from 'utils/Paze';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';

const getPazeVisibility = () => {
    const { isPazeDynamic } = Sephora.configurationSettings;
    const shouldShowPaze = pazeUtils.isPazeVisible();
    let isPazeVisible = false;

    if (isPazeDynamic && shouldShowPaze) {
        const canCheckoutPaze = Storage.local.getItem(LOCAL_STORAGE.CAN_CHECKOUT_PAZE);
        isPazeVisible = canCheckoutPaze;
    } else {
        isPazeVisible = shouldShowPaze;
    }

    return isPazeVisible;
};

const Paze = ({ defaultPayment, handlePaymentClick, isPazeEnabledForThisOrder }) => {
    return getPazeVisibility() ? (
        <PazeRadio
            defaultPayment={defaultPayment}
            disabled={!isPazeEnabledForThisOrder}
            onClick={handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.PAZE)}
        >
            <PazePaymentMethod isFrictionless />
        </PazeRadio>
    ) : null;
};

export default wrapFunctionalComponent(Paze, 'Paze');
