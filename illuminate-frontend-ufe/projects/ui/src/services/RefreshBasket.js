import servicesUtils from 'utils/Services';
const shouldServiceRun = servicesUtils.shouldServiceRun;
import store from 'store/Store';
import AddToBasketActions from 'actions/AddToBasketActions';

export default (function () {
    // Stop service from loading if not necessary
    if (!shouldServiceRun.refreshBasket()) {
        return;
    }

    Sephora.Util.InflatorComps.services.RefreshBasketService = () => {
        store.dispatch(AddToBasketActions.refreshBasket(true));
    };
}());
