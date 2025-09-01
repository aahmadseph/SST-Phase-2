import PlaceOrderTermsModal from 'components/GlobalModals/PlaceOrderTermsModal/PlaceOrderTermsModal';
import withGlobalModals from 'hocs/withGlobalModals';
import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { showPlaceOrderTermsModal } from 'components/FrictionlessCheckout/checkoutActions/actionWrapper';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import { orderSelector } from 'selectors/order/orderSelector';

const { wrapHOC } = FrameworkUtils;

const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/GlobalModals/PlaceOrderTermsModal/locales', 'PlaceOrderTermsModal');

const localizationSelector = createStructuredSelector({
    title: getTextFromResource(getText, 'title'),
    placeOrder: getTextFromResource(getText, 'placeOrder'),
    cancel: getTextFromResource(getText, 'cancel'),
    text: getTextFromResource(getText, 'text'),
    arOnlyTitle: getTextFromResource(getText, 'arOnlyTitle'),
    arOnlyText: getTextFromResource(getText, 'arOnlyText'),
    arSubscriptionTitle: getTextFromResource(getText, 'arSubscriptionTitle'),
    arSubscriptionHeader: getTextFromResource(getText, 'arSubscriptionHeader'),
    arSubscriptionScript: getTextFromResource(getText, 'arSubscriptionScript', [
        '{INSERT FREQUENCY}',
        '{INSERT PRICE}',
        '{INSERT QUANTITY}',
        '{INSERT ITEM}',
        '{INSERT PRODUCT NAME}',
        '{INSERT PRODUCT NAME}'
    ]),
    arsduText: getTextFromResource(getText, 'arsduText'),
    sduLink: getTextFromResource(getText, 'sduLink'),
    and: getTextFromResource(getText, 'and'),
    arLink: getTextFromResource(getText, 'arLink'),
    arsduText2: getTextFromResource(getText, 'arsduText2'),
    sduTrialTitle: getTextFromResource(getText, 'sduTrialTitle'),
    afterSduTrialTitle: getTextFromResource(getText, 'afterSduTrialTitle'),
    sduTrialScriptHeader: getTextFromResource(getText, 'sduTrialScriptHeader'),
    afterSduTrialScriptHeader: getTextFromResource(getText, 'afterSduTrialScriptHeader'),
    sduTrialScript: getTextFromResource(getText, 'sduTrialScript'),
    afterSduTrialScript: getTextFromResource(getText, 'afterSduTrialScript')
});

const fields = createSelector(orderSelector, localizationSelector, (order, localization) => {
    const { acceptAutoReplenishTerms, confirmVerbalConsent, acceptSDUTerms, orderDetails } = order;
    const sduSubscriptions = orderDetails?.items?.items.filter(subscription => subscription.sku.type === 'SDU')[0];
    const orderItems = orderDetails?.items?.items.filter(item => item.sku.type !== 'SDU' && item.isReplenishment);
    const orderTotal = orderDetails?.priceInfo?.orderTotal;
    const sduTrialEligible = sduSubscriptions?.sku.trialEligible;
    const sduResources = sduTrialEligible
        ? {
            title: localization.sduTrialTitle,
            header: localization.sduTrialScriptHeader,
            script: localization.sduTrialScript
        }
        : {
            title: localization.afterSduTrialTitle,
            header: localization.afterSduTrialScriptHeader,
            script: localization.afterSduTrialScript
        };

    return {
        showPlaceOrderTermsModal,
        localization,
        acceptAutoReplenish: acceptAutoReplenishTerms,
        confirmVerbalConsent: confirmVerbalConsent,
        acceptSDUTerms,
        sduScriptTitle: sduResources.title,
        sduScriptHeader: sduResources.header,
        sduScript: sduResources.script,
        orderItems,
        orderTotal
    };
});

const withPlaceOrderTermsModalProps = wrapHOC(connect(fields));

export default withGlobalModals(withPlaceOrderTermsModalProps(PlaceOrderTermsModal));
