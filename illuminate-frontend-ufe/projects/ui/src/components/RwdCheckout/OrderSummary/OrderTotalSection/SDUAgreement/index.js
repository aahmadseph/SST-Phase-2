import SDUAgreement from 'components/RwdCheckout/OrderSummary/OrderTotalSection/SDUAgreement/SDUAgreement';
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

const getText = getLocaleResourceFile('components/Checkout/OrderSummary/OrderTotalSection/SDUAgreement/locales', 'SDUAgreement');

const fields = createSelector(
    orderSelector,
    itemsByBasketSelector,
    userSubscriptionsSelector,
    createStructuredSelector({
        agree: getTextFromResource(getText, 'agree'),
        sephoraSDU: getTextFromResource(getText, 'sephoraSDU'),
        termsAndConditions: getTextFromResource(getText, 'termsAndConditions'),
        afterTrial: getTextFromResource(getText, 'afterTrial', ['{0}']),
        authorize: getTextFromResource(getText, 'authorize', ['{0}']),
        byClicking: getTextFromResource(getText, 'byClicking'),
        termsOfService: getTextFromResource(getText, 'termsOfService'),
        conditionsOfUse: getTextFromResource(getText, 'conditionsOfUse'),
        privacyPolicy: getTextFromResource(getText, 'privacyPolicy')
    }),
    (order, itemsByBasket, userSubscriptions, { afterTrial, authorize, ...restTextResources }) => {
        const { acceptSDUTerms } = order;
        const sameDayBasket = itemsByBasket.filter(basket => basket.basketType === 'SameDay');
        const sduProduct = sameDayBasket[0]?.items.filter(item => item.sku.type === 'SDU')[0];
        const price = sduProduct?.sku.listPrice || '';
        const sduSubscriptions = userSubscriptions.filter(subscription => subscription.type === 'SDU')[0];
        const agreementText = sduSubscriptions?.isTrialEligible ? StringUtils.format(afterTrial, price) : StringUtils.format(authorize, price);

        return {
            ...restTextResources,
            acceptSDUTerms,
            agreementText
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
