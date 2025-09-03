import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Campaigns/RwdAdvocacy/AdvocacyViews/AdvocacySuccess/locales', 'AdvocacySuccess');

const { wrapHOC } = FrameworkUtils;

const localization = createStructuredSelector({
    yourNextPurchase: getTextFromResource(getText, 'yourNextPurchase'),
    redemptionInstructions: getTextFromResource(getText, 'redemptionInstructions'),
    barcodeScan: getTextFromResource(getText, 'barcodeScan'),
    shopNow: getTextFromResource(getText, 'shopNow'),
    redeemOnline: getTextFromResource(getText, 'redeemOnline'),
    valid: getTextFromResource(getText, 'valid')
});

const fields = createSelector(userSelector, localization, (user, locales) => {
    return {
        user,
        locales
    };
});

const functions = null;

const withAdvocacySuccessProps = wrapHOC(connect(fields, functions));

export {
    withAdvocacySuccessProps, fields, functions
};
