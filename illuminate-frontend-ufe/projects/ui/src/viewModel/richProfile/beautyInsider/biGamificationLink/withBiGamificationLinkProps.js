import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import anaUtils from 'analytics/utils';

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/RichProfile/BeautyInsider/BiGamificationLink/locales', 'BiGamificationLink');

export default connect(
    createSelector(
        createStructuredSelector({
            new: getTextFromResource(getText, 'new'),
            beautyChallenges: getTextFromResource(getText, 'beautyChallenges')
        }),
        localization => {
            const trackAnalytics = () => {
                anaUtils.setNextPageData({ linkData: `gamification:bisummary:${localization.beautyChallenges.toLowerCase()}` });
            };

            return {
                localization,
                trackAnalytics
            };
        }
    )
);
