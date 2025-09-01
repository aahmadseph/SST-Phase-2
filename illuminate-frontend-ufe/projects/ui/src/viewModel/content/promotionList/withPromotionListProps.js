import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import appliedPromotionsSelector from 'selectors/basket/appliedPromotions/appliedPromotionsSelector';
import { personalizationSelector } from 'viewModel/selectors/personalization/personalizationSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import { dynamicComponentSelector } from 'viewModel/selectors/dynamicComponent/dynamicComponentSelector';
import FrameworkUtils from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import Empty from 'constants/empty';
import PersonalizationUtils from 'utils/Personalization';

const { wrapHOC } = FrameworkUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/PromotionList/locales', 'PromotionList');

const fields = createSelector(
    coreUserDataSelector,
    personalizationSelector,
    appliedPromotionsSelector,
    dynamicComponentSelector,
    (_state, ownProps) => ownProps.items,
    (_state, ownProps) => ownProps.showSkeleton,
    (_state, ownProps) => ownProps.features,
    (_state, ownProps) => ownProps.personalization,
    createStructuredSelector({
        viewAll: getTextFromResource(getText, 'viewAll')
    }),
    (user, personalization, appliedPromotions, dynamicComponentData, items, showSkeleton, features, componentPersonalization, localization) => {
        const { personalizedComponent, isPersonalizationInitializing } = personalization;
        const { dynamicComponent, isDynamicComponentInitializing } = dynamicComponentData;

        const dynamicItems = dynamicComponent?.items;
        const personalizedItems = personalizedComponent?.variationData?.items;

        const isSkeleton = showSkeleton || (user.isInitialized && isPersonalizationInitializing) || isDynamicComponentInitializing;

        // we need to check on priority for personalizedItems vs dynamicItems
        const newItems = personalizedItems || dynamicItems || items || Empty.Array;
        const showPersonalizationOverlay = PersonalizationUtils.shouldShowPersonalizationOverlay(componentPersonalization?.isNBOEnabled);

        return {
            user,
            localization,
            appliedPromotions,
            isPersonalizationInitializing,
            showPersonalizationOverlay,
            items: newItems,
            showSkeleton: isSkeleton,
            areItemsPersonalized: (personalizedItems || Empty.Array)?.length !== 0,
            isNBOEnabled: componentPersonalization?.isNBOEnabled
        };
    }
);

const withPromotionListProps = wrapHOC(connect(fields));

export {
    fields, withPromotionListProps
};
