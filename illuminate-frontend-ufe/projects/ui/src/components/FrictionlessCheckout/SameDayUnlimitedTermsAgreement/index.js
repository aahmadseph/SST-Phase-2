import SDUAgreement from './SameDayUnlimitedTermsAgreement.f';
import withGlobalModals from 'hocs/withGlobalModals';
import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { orderSelector } from 'selectors/order/orderSelector';
import OrderActions from 'actions/OrderActions';
import itemsByBasketSelector from 'selectors/basket/itemsByBasket/itemsByBasketSelector';
import UserSubscriptionsSelector from 'selectors/user/userSubscriptions/userSubscriptionsSelector';
import sduAgreementActions from 'actions/sduAgreementActions';
import StringUtils from 'utils/String';

const { wrapHOC } = FrameworkUtils;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { showPrivacyPolicyModal, showTermsAndConditionsModal, showTermsOfServiceModal } = sduAgreementActions;

const getText = getLocaleResourceFile('components/FrictionlessCheckout/SameDayUnlimitedTermsAgreement/locales', 'SDUAgreement');

const fields = createSelector(
    orderSelector,
    itemsByBasketSelector,
    userSubscriptionsSelector,
    createStructuredSelector({
        byClicking: getTextFromResource(getText, 'byClicking'),
        termsOfService: getTextFromResource(getText, 'termsOfService'),
        conditionsOfUse: getTextFromResource(getText, 'conditionsOfUse'),
        privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
        sduTermsLink: getTextFromResource(getText, 'sduTermsLink'),
        sduAgreementIntro: getTextFromResource(getText, 'sduAgreementIntro'),
        sduTrialDetailsText: getTextFromResource(getText, 'sduTrialDetailsText', ['{0}']),
        sduSubscriptionDetailsText: getTextFromResource(getText, 'sduSubscriptionDetailsText', ['{0}'])
    }),
    (order, itemsByBasket, userSubscriptions, textResources) => {
        const { acceptSDUTerms } = order;
        const sameDayBasket = itemsByBasket.filter(basket => basket.basketType === 'SameDay');
        const sduProduct = sameDayBasket[0]?.items.filter(item => item.sku.type === 'SDU')[0];
        const price = sduProduct?.sku.listPrice || '';
        const sduSubscriptions = userSubscriptions.filter(subscription => subscription.type === 'SDU')[0];
        const isSDUProductInBasket = !!sduProduct;

        // Determine if this is a trial or subscription
        const isTrialEligible = sduSubscriptions?.isTrialEligible || false;

        // Prepare SDU agreement data for component with meaningful names
        const agreementIntro = textResources.sduAgreementIntro;

        const agreementDetails = isTrialEligible
            ? StringUtils.format(textResources.sduTrialDetailsText, price)
            : StringUtils.format(textResources.sduSubscriptionDetailsText, price);

        return {
            ...textResources,
            acceptSDUTerms,
            agreementIntro,
            agreementDetails,
            isSDUProductInBasket
        };
    }
);

const functions = {
    showTermsOfServiceModal,
    showTermsAndConditionsModal,
    showPrivacyPolicyModal,
    updateSDUTerms: OrderActions.updateSDUTerms
};

const withSDUAgreementProps = wrapHOC(connect(fields, functions));

export default withGlobalModals(withSDUAgreementProps(SDUAgreement));
