import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { personalizationSelector } from 'viewModel/selectors/personalization/personalizationSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Empty from 'constants/empty';
import Location from 'utils/Location';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getText = getLocaleResourceFile('components/Content/PromotionListHandler/PromotionListForYouHandler/locales', 'PromotionListForYouHandler');

const fields = createSelector(
    coreUserDataSelector,
    personalizationSelector,
    createStructuredSelector({
        forYouTitle: getTextFromResource(getText, 'forYou')
    }),
    (user, personalization, textResources) => {
        const { personalizedComponent, isPersonalizationInitializing } = personalization;
        const personalizedItems = personalizedComponent?.variationData?.items || Empty.Array;
        const isSYSPage = Location.isShopMyStorePage() || Location.isShopSameDayPage();

        if (Location.isHomepage() || isSYSPage) {
            if (user.isAnonymous) {
                return {
                    showFallback: false
                };
            }

            if (personalizedItems.length === 0) {
                return {
                    showFallback: false,
                    title: `${textResources.forYouTitle}, ${user.firstName} ❤️`
                };
            }
        }

        const title = `${textResources.forYouTitle}, ${user.firstName} ❤️`;
        const showSkeleton = isPersonalizationInitializing;
        const showFallback =
            showSkeleton || // skeletonScreen
            user.isAnonymous || // signInScreen
            (!showSkeleton && (personalizedItems || [])?.length === 0); // fallBackScreen

        return {
            user,
            showSkeleton,
            showFallback,
            items: personalizedItems,
            title
        };
    }
);

const withPromotionListForYouHandlerProps = wrapHOC(connect(fields));

export {
    fields, withPromotionListForYouHandlerProps
};
