import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import PlaceOrderButton from 'components/RwdCheckout/PlaceOrderButton/PlaceOrderButton';
import OrderActions from 'actions/OrderActions';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/RwdCheckout/PlaceOrderButton/locales', 'PlaceOrderButton');

const textResources = createStructuredSelector({
    denialMessage: getTextFromResource(getText, 'denialMessage'),
    placeOrder: getTextFromResource(getText, 'placeOrder'),
    items: getTextFromResource(getText, 'items'),
    item: getTextFromResource(getText, 'item'),
    orderTotal: getTextFromResource(getText, 'orderTotal')
});

const connectedPlaceOrderButton = connect(
    createSelector(textResources, texts => {
        const originOfOrder = Sephora.isMobile() ? 'mobileWeb' : 'web';
        const { togglePlaceOrderDisabled } = OrderActions;

        return {
            ...texts,
            getText,
            originOfOrder,
            togglePlaceOrderDisabled
        };
    })
);

const withPlaceOrderButtonProps = wrapHOC(connectedPlaceOrderButton);

export default withPlaceOrderButtonProps(PlaceOrderButton);
