import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';
import {
    notSureOption,
    noPreferenceOptions,
    PREFERENCE_TYPES,
    SHOPPING_LINKS_BY_CATEGORY,
    SHOPPING_LINKS_EXCLUDED_ATTRIBUTES
} from 'constants/beautyPreferences';
import BeautyPreferencesUtils from 'utils/BeautyPreferences';
import { textItemsSelector as beautyProfileHeadingTextResources } from 'viewModel/header/beautyPreferences/beautyProfileHeading/withBeautyProfileHeadingProps';
import { tiledProfileContentSelector as tiledProfileContentTextResources } from 'viewModel/header/beautyPreferences/tiledProfileContent/withTiledProfileContentProps';
import { localization as preferencesModalTextResources } from 'viewModel/header/beautyPreferences/preferencesModal/withPreferencesModalProps';
import LanguageLocaleUtils from 'utils/LanguageLocale';

const { isAllAnswered } = BeautyPreferencesUtils;
const { wrapHOC } = FrameworkUtils;
const { isFrench, getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const {
    PAGE_NAMES: { MY_SEPHORA }
} = anaConsts;

const getText = getLocaleResourceFile('components/Header/BeautyPreferences/ShoppingLinks/locales', 'ShoppingLinks');

const localization = createStructuredSelector({
    skinTypeLink: getTextFromResource(getText, 'skinTypeLink'),
    skinConcernsLink: getTextFromResource(getText, 'skinConcernsLink'),
    fragrancePreferencesLink: getTextFromResource(getText, 'fragrancePreferencesLink'),
    hairDescribleLink: getTextFromResource(getText, 'hairDescribleLink'),
    hairTextureLink: getTextFromResource(getText, 'hairTextureLink'),
    hairConcernsLink: getTextFromResource(getText, 'hairConcernsLink'),
    shoppingPreferencesDesc: getTextFromResource(getText, 'shoppingPreferencesDesc'),
    favoriteBrandsDesc: getTextFromResource(getText, 'favoriteBrandsDesc'),
    ingredientPreferencesDesc: getTextFromResource(getText, 'ingredientPreferencesDesc'),
    colorIQLink: getTextFromResource(getText, 'colorIQLink'),
    makeupLink: getTextFromResource(getText, 'makeupLink'),
    skincareLink: getTextFromResource(getText, 'skincareLink'),
    hairLink: getTextFromResource(getText, 'hairLink'),
    fragranceLink: getTextFromResource(getText, 'fragranceLink')
});

const fields = createSelector(
    (_, ownProps) => ownProps.beautyPreferences,
    (_, ownProps) => ownProps.category,
    localization,
    beautyProfileHeadingTextResources,
    tiledProfileContentTextResources,
    preferencesModalTextResources,
    (beautyPreferences, category, textResources, headingsTextResources, contentTextResources, preferencesModalTexts) => {
        const combinedTextResources = { ...textResources, ...headingsTextResources, ...contentTextResources, ...preferencesModalTexts };
        const { type } = category;

        const isMultiLink = SHOPPING_LINKS_BY_CATEGORY[type]?.isMultiLink;
        const isColorIQCategory = type === PREFERENCE_TYPES.COLOR_IQ;
        const categoryValuesTemp = beautyPreferences[type] || [];
        const categoryValues = Array.isArray(categoryValuesTemp) ? categoryValuesTemp : [categoryValuesTemp];
        const isEnabled =
            !isFrench() &&
            !!SHOPPING_LINKS_BY_CATEGORY[type] &&
            ((isColorIQCategory && !!categoryValues.length) || isAllAnswered(beautyPreferences, SHOPPING_LINKS_EXCLUDED_ATTRIBUTES));
        const isNoPreference = isColorIQCategory
            ? !(categoryValues.length > 0)
            : categoryValues.some(value => value === notSureOption || noPreferenceOptions.some(option => option.includes(value)));

        const constructURLQueryParams = () => {
            if (isColorIQCategory) {
                const latestColorIQPref = categoryValues[0];
                const { labValue } = latestColorIQPref;
                const [l, a, b] = labValue.split(/,|:/);

                return `?l=${l}&a=${a}&b=${b}`;
            }

            const filterRef = SHOPPING_LINKS_BY_CATEGORY[type]?.filterRef;
            const params = [];

            for (const subcat of categoryValues) {
                const subcatFilterName = SHOPPING_LINKS_BY_CATEGORY[type]?.subcatFilterRef?.[subcat];
                const filter = `filters[${filterRef}]=${subcatFilterName}`;
                params.push(filter);
            }

            return `?ref=${params.join(',')}`;
        };

        const handleClick = () => {
            // linkData analitycs prop55 for next page load
            anaUtils.setNextPageData({
                linkData: `${MY_SEPHORA}:bluelink:${combinedTextResources[type].toLowerCase()}`
            });
        };

        // multi-link variation
        if (isMultiLink && !isNoPreference) {
            const multiLinkData = {
                linksDesc: combinedTextResources[SHOPPING_LINKS_BY_CATEGORY[type]?.copy],
                links: SHOPPING_LINKS_BY_CATEGORY[type]?.links.map(({ copy, url }) => {
                    const queryParams = constructURLQueryParams();
                    const href = url + queryParams;
                    const text = combinedTextResources[copy];
                    const linkData = { href, text, handleClick };

                    return linkData;
                })
            };

            const newProps = { isEnabled, isMultiLink, multiLinkData };

            return newProps;
        }

        // single-link variation
        if (!isMultiLink && !isNoPreference) {
            const url = SHOPPING_LINKS_BY_CATEGORY[type]?.url;
            const text = combinedTextResources[SHOPPING_LINKS_BY_CATEGORY[type]?.copy];
            const queryParams = constructURLQueryParams();
            const href = url + queryParams;
            const linkData = { href, text, handleClick };

            const newProps = { isEnabled, linkData };

            return newProps;
        }

        return { isEnabled: false };
    }
);

const withShoppingLinksProps = wrapHOC(connect(fields));

export {
    fields, withShoppingLinksProps
};
