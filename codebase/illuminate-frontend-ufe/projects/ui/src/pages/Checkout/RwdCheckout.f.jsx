import ufeApi from 'services/api/ufeApi';
import store from 'store/Store';
import RwdCheckoutMain from 'components/RwdCheckout/RwdCheckoutMain';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import CreditCardActions from 'actions/CreditCardActions';

const { updateCCBanner } = CreditCardActions;

const RwdCheckout = ({ regions, checkoutCcBanner, data }) => {
    if (checkoutCcBanner) {
        store.dispatch(updateCCBanner(checkoutCcBanner));
    }

    return (
        <RwdCheckoutMain
            requestCounter={ufeApi.getCallsCounter()}
            regions={regions}
            contentData={data?.contentZone}
            cmsData={data}
        />
    );
};

export default withAfterEventsRendering(wrapFunctionalComponent(RwdCheckout, 'RwdCheckout', true), ['OrderInfoReady']);
