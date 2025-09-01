import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import FrameworkUtils from 'utils/framework';
import Location from 'utils/Location';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import UserUtils from 'utils/User';
import Empty from 'constants/empty';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;

const getForYouHandlerText = getLocaleResourceFile(
    'components/Content/PromotionListHandler/PromotionListForYouHandler/locales',
    'PromotionListForYouHandler'
);
const getFeaturedOffersHandlerText = getLocaleResourceFile(
    'components/Content/PromotionListHandler/PromotionListFeaturedOffersHandler/locales',
    'PromotionListFeaturedOffersHandler'
);

const fields = createSelector(
    coreUserDataSelector,
    (_state, ownProps) => ownProps.featuresDataCollection,
    (_state, ownProps) => ownProps.areItemsPersonalized,
    (_state, ownProps) => ownProps.isPersonalizationInitializing,
    (_state, ownProps) => ownProps.showSkeleton,
    createStructuredSelector({
        forYouTitle: getTextFromResource(getForYouHandlerText, 'forYou'),
        featuredOffersTitle: getTextFromResource(getFeaturedOffersHandlerText, 'featuredOffers')
    }),
    (user, featuredDataCollection, areItemsPersonalized, isPersonalizationInitializing, parentShowSkeleton, textResources) => {
        // Items are already personalized, omit processing default items
        if (areItemsPersonalized && !user.isAnonymous && Location.isBasketPage() && Sephora.configurationSettings.isBasketPersonalizationEnabled) {
            return {
                title: `${textResources.forYouTitle}, ${UserUtils.getProfileFirstName()} ❤️`
            };
        }

        const { items: featuredDataCollectionItems } = featuredDataCollection?.items?.[0] || Empty.Object;

        // Preserve skeleton state from parent withPromotionListProps (includes SSR logic)
        const shouldShowSkeleton = parentShowSkeleton || isPersonalizationInitializing;

        return {
            title: textResources.featuredOffersTitle,
            showSkeleton: shouldShowSkeleton,
            items: featuredDataCollectionItems
        };
    }
);

const withPromotionListFeaturedOffersHandlerProps = wrapHOC(connect(fields));

export {
    withPromotionListFeaturedOffersHandlerProps, fields
};
