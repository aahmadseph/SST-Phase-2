import React, { useEffect } from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import OrderUtils from 'utils/Order';
import localeUtils from 'utils/LanguageLocale';
import Venmo from 'utils/Venmo';
import VenmoPaymentMethod from 'components/Venmo/VenmoPaymentMethod';
import VenmoRadio from 'components/FrictionlessCheckout/Payment/PaymentMethodList/VenmoRadio';

const VenmoComponent = ({ defaultPayment, handlePaymentClick, isVenmoEnabledForThisOrder = true }) => {
    const { isVenmoEnabled } = Sephora.configurationSettings;
    const shouldShowVenmo = isVenmoEnabled && localeUtils.isUS();

    useEffect(() => {
        if (shouldShowVenmo) {
            Venmo.prepareVenmoCheckout();
        }
    }, []);

    return shouldShowVenmo ? (
        <VenmoRadio
            defaultPayment={defaultPayment}
            disabled={!isVenmoEnabledForThisOrder}
            onClick={handlePaymentClick(OrderUtils.PAYMENT_GROUP_TYPE.VENMO)}
        >
            <VenmoPaymentMethod marginLeft={[6]} />
        </VenmoRadio>
    ) : null;
};

export default wrapFunctionalComponent(VenmoComponent, 'Venmo');
