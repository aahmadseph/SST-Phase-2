import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import { authSelector } from 'selectors/auth/authSelector';
import { userSelector } from 'selectors/user/userSelector';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import FrameworkUtils from 'utils/framework';
import Location from 'utils/Location';
import userUtils from 'utils/User';
import PersonalizationUtils from 'utils/Personalization';
import contentConstants from 'constants/content';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import skuUtils from 'utils/Sku';

const { PRODUCT_LIST_VARIANTS } = contentConstants;

const { wrapHOC } = FrameworkUtils;

const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Content/ProductList/locales', 'ProductList');
const { getPersonalizedComponent } = PersonalizationUtils;

const isElegibleForPersonalization = productList => {
    return (
        !productList.variant || productList.variant === PRODUCT_LIST_VARIANTS.SMALL_GRID || productList.variant === PRODUCT_LIST_VARIANTS.LARGE_GRID
    );
};

const localization = createStructuredSelector({
    showMore: getTextFromResource(getText, 'showMore'),
    rougeBadgeText: getTextFromResource(getText, 'rougeBadge'),
    signInToAccess: getTextFromResource(getText, 'signInToAccess'),
    viewAll: getTextFromResource(getText, 'viewAll')
});

const fields = createSelector(
    localization,
    p13nSelector,
    coreUserDataSelector,
    userSelector,
    authSelector,
    (_state, ownProps) => ownProps,
    (locale, p13n, userData, user, auth, productListProps) => {
        let skuList = productListProps.skuList;
        const isRewardProductList = productListProps?.isRewardProductList || skuUtils.isBiReward(skuList?.[0]) || false;
        let showSkeletonBDLP = false;

        if (Sephora.configurationSettings?.isBirthdayLandingPageP13NEnabled) {
            if (Location.isBirthdayGiftPage() && productListProps.dynamicSorting && isElegibleForPersonalization(productListProps)) {
                showSkeletonBDLP = true;

                // We simulate a personalization object, since the personalization is coming in the heroBanner of the birthday landing page
                const productListPersonalization = {
                    context: productListProps.sid,
                    isEnabled: true
                };

                const personalizedComponent = getPersonalizedComponent(productListPersonalization, userData, p13n, true);

                if (personalizedComponent) {
                    skuList = personalizedComponent?.variationData?.skuList || skuList;
                }
            }
        }

        const isAnonymous = user?.isInitialized && userUtils.isAnonymous(auth);

        return {
            localization: locale,
            skuList,
            isRewardProductList,
            updateRougeExclusiveSkus: rougeExclusiveUtils.updateRougeExclusiveSkus,
            isAnonymous,
            showSkeletonBDLP: showSkeletonBDLP
        };
    }
);

const withProductListProps = wrapHOC(connect(fields));

export { withProductListProps };
