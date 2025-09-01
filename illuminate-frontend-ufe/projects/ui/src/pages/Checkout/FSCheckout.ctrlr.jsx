import ufeApi from 'services/api/ufeApi';
import store from 'store/Store';
import FrictionlessCheckout from 'components/FrictionlessCheckout';
import framework from 'utils/framework';
const { wrapFunctionalComponent } = framework;
import withAfterEventsRendering from 'hocs/withAfterEventsRendering';
import CreditCardActions from 'actions/CreditCardActions';
import Empty from 'constants/empty';

const { updateCCBanner } = CreditCardActions;

const FrictionlessCheckoutPage = ({ checkoutCcBanner, data, biBenefitsModals }) => {
    if (checkoutCcBanner) {
        store.dispatch(updateCCBanner(checkoutCcBanner));
    }

    const biBenifits = data?.beautyInsiderBenefitsCollection?.items[0]?.itemsCollection;

    return (
        <FrictionlessCheckout
            requestCounter={ufeApi.getCallsCounter()}
            contentData={data || Empty.Object}
            biBenifits={biBenifits?.items || Empty.Array}
            biBenefitsModals={biBenefitsModals || Empty.Object}
        />
    );
};

export default withAfterEventsRendering(wrapFunctionalComponent(FrictionlessCheckoutPage, 'FrictionlessCheckoutPage', true), ['OrderInfoReady']);
