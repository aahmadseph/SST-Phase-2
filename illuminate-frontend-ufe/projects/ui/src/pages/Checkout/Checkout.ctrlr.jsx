import React from 'react';
import ufeApi from 'services/api/ufeApi';
import store from 'store/Store';
import BaseClass from 'components/BaseClass';
import CheckoutMain from 'components/Checkout/CheckoutMain';
import withClientSideRenderOnly from 'hocs/withClientSideRenderOnly';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import CreditCardActions from 'actions/CreditCardActions';

const { updateCCBanner } = CreditCardActions;

class Checkout extends BaseClass {
    render() {
        const { regions, checkoutCcBanner, data } = this.props;

        if (checkoutCcBanner) {
            store.dispatch(updateCCBanner(checkoutCcBanner));
        }

        return (
            <CheckoutMain
                requestCounter={ufeApi.getCallsCounter()}
                regions={regions}
                data={data}
            />
        );
    }
}

export default withAfterEventsRendering(withClientSideRenderOnly()(wrapComponent(Checkout, 'Checkout', true)), ['OrderInfoReady']);
