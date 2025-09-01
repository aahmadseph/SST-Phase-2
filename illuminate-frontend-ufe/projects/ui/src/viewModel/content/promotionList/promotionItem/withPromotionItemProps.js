import { connect } from 'react-redux';
import { createStructuredSelector, createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/PromotionList/locales', 'PromotionList');

const withPromotionItemProps = wrapHOC(
    connect(
        createSelector(
            createStructuredSelector({
                ctaApply: getTextFromResource(getText, 'ctaApply'),
                ctaApplied: getTextFromResource(getText, 'ctaApplied'),
                ctaRemove: getTextFromResource(getText, 'ctaRemove'),
                ctaUrl: getTextFromResource(getText, 'ctaUrl'),
                ctaAppOnly: getTextFromResource(getText, 'ctaAppOnly'),
                ctaStoreOnly: getTextFromResource(getText, 'ctaStoreOnly'),
                seeDetails: getTextFromResource(getText, 'seeDetails'),
                insider: getTextFromResource(getText, 'insider'),
                vib: getTextFromResource(getText, 'vib'),
                rouge: getTextFromResource(getText, 'rouge'),
                ends: getTextFromResource(getText, 'ends'),
                appOnly: getTextFromResource(getText, 'appOnly'),
                onlineOnly: getTextFromResource(getText, 'onlineOnly'),
                storeOnly: getTextFromResource(getText, 'storeOnly'),
                inStoreOrOnline: getTextFromResource(getText, 'inStoreOrOnline'),
                daysLeft: getTextFromResource(getText, 'daysLeft'),
                dayLeft: getTextFromResource(getText, 'dayLeft'),
                lastDay: getTextFromResource(getText, 'lastDay')
            }),
            localization => {
                return { localization };
            }
        )
    )
);

export { withPromotionItemProps };
