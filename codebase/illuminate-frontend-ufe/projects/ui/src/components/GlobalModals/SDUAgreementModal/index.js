import SDUAgreementModal from 'components/GlobalModals/SDUAgreementModal/SDUAgreementModal';
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
import Actions from 'Actions';
import localeUtils from 'utils/LanguageLocale';
import orderLocaleSelector from 'selectors/order/orderDetails/header/orderLocale/orderLocaleSelector';

const { wrapHOC } = FrameworkUtils;
const { userSubscriptionsSelector } = UserSubscriptionsSelector;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const { showPrivacyPolicyModal, showTermsAndConditionsModal, showTermsOfServiceModal } = sduAgreementActions;

const getText = getLocaleResourceFile('components/GlobalModals/SDUAgreementModal/locales', 'SDUAgreementModal');

const fields = createSelector(
    orderSelector,
    itemsByBasketSelector,
    userSubscriptionsSelector,
    orderLocaleSelector,
    createStructuredSelector({
        agree: getTextFromResource(getText, 'agree'),
        toThe: getTextFromResource(getText, 'toThe'),
        sephoraSDU: getTextFromResource(getText, 'sephoraSDU'),
        termsAndConditions: getTextFromResource(getText, 'termsAndConditions'),
        afterTrial: getTextFromResource(getText, 'afterTrial', ['{0}']),
        authorize: getTextFromResource(getText, 'authorize', ['{0}']),
        byClicking: getTextFromResource(getText, 'byClicking'),
        termsOfService: getTextFromResource(getText, 'termsOfService'),
        conditionsOfUse: getTextFromResource(getText, 'conditionsOfUse'),
        privacyPolicy: getTextFromResource(getText, 'privacyPolicy'),
        title: getTextFromResource(getText, 'title'),
        almostThere: getTextFromResource(getText, 'almostThere'),
        placeOrder: getTextFromResource(getText, 'placeOrder'),
        agentConfirmPrefix: getTextFromResource(getText, 'agentConfirmPrefix'),
        sameDayHyphenated: getTextFromResource(getText, 'sameDayHyphenated'),
        agentConfirmSuffix: getTextFromResource(getText, 'agentConfirmSuffix'),
        sduTrialTitle: getTextFromResource(getText, 'sduTrialTitle'),
        sduTrialScriptHeader: getTextFromResource(getText, 'sduTrialScriptHeader'),
        sduTrialScript: getTextFromResource(getText, 'sduTrialScript', ['{0}']),
        afterSduTrialTitle: getTextFromResource(getText, 'afterSduTrialTitle'),
        afterSduTrialScriptHeader: getTextFromResource(getText, 'afterSduTrialScriptHeader'),
        afterSduTrialScript: getTextFromResource(getText, 'afterSduTrialScript', ['{0}']),
        cancelText: getTextFromResource(getText, 'cancelText')
    }),
    (order, itemsByBasket, userSubscriptions, orderLocale, { afterTrial, authorize, ...restTextResources }) => {
        const { acceptSDUTerms } = order;
        const sameDayBasket = itemsByBasket.filter(basket => basket.basketType === 'SameDay');
        const sduProduct = sameDayBasket[0]?.items.filter(item => item.sku.type === 'SDU')[0];
        const price = sduProduct?.sku.listPrice || '';
        const sduSubscriptions = userSubscriptions.filter(subscription => subscription.type === 'SDU')[0];
        const sduTrialEligible = sduSubscriptions?.isTrialEligible;
        const scriptText = orderLocale === localeUtils.COUNTRIES.CA ? 'fifty-nine' : 'forty-nine';

        const sduResources = sduTrialEligible
            ? {
                title: restTextResources.sduTrialTitle,
                header: restTextResources.sduTrialScriptHeader,
                script: StringUtils.format(restTextResources.sduTrialScript, scriptText),
                agreementText: StringUtils.format(afterTrial, price)
            }
            : {
                title: restTextResources.afterSduTrialTitle,
                header: restTextResources.afterSduTrialScriptHeader,
                script: StringUtils.format(restTextResources.afterSduTrialScript, scriptText),
                agreementText: StringUtils.format(authorize, price)
            };

        return {
            ...restTextResources,
            acceptSDUTerms,
            agreementText: sduResources.agreementText,
            sduScriptTitle: sduResources.title,
            sduScriptHeader: sduResources.header,
            sduScript: sduResources.script,
            isBopis: sameDayBasket[0]?.fulfillmentType === 'StorePickup',
            isSDUItemInBasket: !!sduProduct
        };
    }
);

const functions = {
    showTermsOfServiceModal,
    showTermsAndConditionsModal,
    showPrivacyPolicyModal,
    updateSDUTerms: OrderActions.updateSDUTerms,
    showSDUAgreementModal: Actions.showSDUAgreementModal
};

const withSDUAgreementProps = wrapHOC(connect(fields, functions));

export default withGlobalModals(withSDUAgreementProps(SDUAgreementModal));
