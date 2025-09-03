import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import GiftCard from 'components/FrictionlessCheckout/Payment/GiftCard/GiftCard';
import checkoutApi from 'services/api/checkout';
import decorators from 'utils/decorators';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import store from 'store/Store';
import { refreshCheckout } from 'components/FrictionlessCheckout/checkoutService/checkoutService';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/FrictionlessCheckout/Payment/locales', 'Payment');

const localization = createStructuredSelector({
    useGiftCard: getTextFromResource(getText, 'useGiftCard'),
    giftCardNumber: getTextFromResource(getText, 'giftCardNumber'),
    pin: getTextFromResource(getText, 'pin'),
    applyBtn: getTextFromResource(getText, 'applyBtn'),
    cancelBtn: getTextFromResource(getText, 'cancelBtn')
});

const fields = createSelector(localization, locales => {
    return {
        localization: locales
    };
});

const functions = {
    applyGiftCard: (giftCard, callback) => {
        return decorators
            .withInterstice(
                checkoutApi.applyGiftCard,
                INTERSTICE_DELAY_MS
            )(giftCard)
            .then(() => {
                store.dispatch(refreshCheckout());
                callback();
            });
    }
};

const withGiftCardProps = wrapHOC(connect(fields, functions));

export default withGiftCardProps(GiftCard);
