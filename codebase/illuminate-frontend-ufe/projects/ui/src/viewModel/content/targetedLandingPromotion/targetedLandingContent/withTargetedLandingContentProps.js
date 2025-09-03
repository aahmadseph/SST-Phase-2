import { createSelector, createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import FrameworkUtils from 'utils/framework';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getLocaleResourceFile, getTextFromResource } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/TargetedLandingPromotion/TargetedLandingContent/locales', 'TargetedLandingContent');

const localization = createStructuredSelector({
    redemptionInstructions: getTextFromResource(getText, 'redemptionInstructions'),
    redeemOnline: getTextFromResource(getText, 'redeemOnline'),
    scanInStoreToRedeem: getTextFromResource(getText, 'scanInStoreToRedeem'),
    shopNow: getTextFromResource(getText, 'shopNow'),
    valid: getTextFromResource(getText, 'valid')
});

const fields = createSelector(userSelector, localization, (user, locales) => {
    return {
        user,
        locales
    };
});

const functions = null;

const withTargetedLandingContentProps = wrapHOC(connect(fields, null));

export {
    withTargetedLandingContentProps, fields, functions
};
