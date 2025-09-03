import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import GiftCardForm from 'components/RwdCheckout/Sections/Payment/GiftCardSection/GiftCardForm/GiftCardForm';
import EditDataActions from 'actions/EditDataActions';
import checkoutApi from 'services/api/checkout';
import decorators from 'utils/decorators';
import OrderActions from 'actions/OrderActions';
import { INTERSTICE_DELAY_MS } from 'components/RwdCheckout/constants';
import store from 'store/Store';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RwdCheckout/Sections/Payment/GiftCardSection/locales', 'GiftCardSection');

const localization = createStructuredSelector({
    giftCardNumberText: getTextFromResource(getText, 'giftCardNumber'),
    pin: getTextFromResource(getText, 'pin'),
    apply: getTextFromResource(getText, 'apply')
});

const fields = createStructuredSelector({
    localization
});

const functions = {
    updateEditData: EditDataActions.updateEditData,
    clearEditData: sectionName => EditDataActions.clearEditData(sectionName),
    applyGiftCard: (giftCard, sectionName) => {
        return decorators
            .withInterstice(
                checkoutApi.applyGiftCard,
                INTERSTICE_DELAY_MS
            )(giftCard)
            .then(() => {
                store.dispatch(EditDataActions.clearEditData(sectionName));
                store.dispatch(OrderActions.giftCardApplied());
            });
    }
};

const withComponentProps = wrapHOC(connect(fields, functions));

export default withComponentProps(GiftCardForm);
