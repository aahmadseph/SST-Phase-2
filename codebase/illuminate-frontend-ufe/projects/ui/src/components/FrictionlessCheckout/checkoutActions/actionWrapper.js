import store from 'store/Store';
import OrderActions from 'actions/OrderActions';
import historyLocationActions from 'actions/framework/HistoryLocationActions';
import checkoutUtils from 'utils/Checkout';
import Actions from 'Actions';

const CHECKOUT_SECTIONS = checkoutUtils.CHECKOUT_SECTIONS;
const CHECKOUT_PATH = checkoutUtils.CHECKOUT_PATH;

const resetAccessPoint = () => {
    store.dispatch(OrderActions.removeHalAddress());
    store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
};

const changeRoute = checkoutPath => {
    const path = `${CHECKOUT_PATH}/${checkoutPath}`;
    store.dispatch(historyLocationActions.goTo({ path }));
    store.dispatch(OrderActions.togglePlaceOrderDisabled(true));
};

const createDraftHalAddress = (address, shippingGroupId, halOperatingHours) => {
    store.dispatch(OrderActions.createDraftHalAddress(address, shippingGroupId, halOperatingHours)).then(() => {
        changeRoute(CHECKOUT_SECTIONS.SHIP_ADDRESS.path);
    });
};

const showPlaceOrderTermsModal = (isOpen, arOnly = false) => {
    store.dispatch(Actions.showPlaceOrderTermsModal({ isOpen, arOnly }));
};

export {
    createDraftHalAddress, resetAccessPoint, changeRoute, showPlaceOrderTermsModal
};
