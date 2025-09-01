import Helpers from 'utils/Helpers';
import * as catalogConstants from 'constants/Search';
import urlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';

const CatalogSortOption = catalogConstants.SEARCH_SORT_OPTIONS;

/**
 * Gets the catalog info from a categories array using the
 * search parameters passed in the options.
 *
 * @param   {array} categories - A categories object
 * @param   {object} options - An object of options in the following format:
 *          { parameter: 'isSelected', value: true }
 */

function getCatalogInfoFromCategories(categories, options) {
    if (!categories || categories[options.parameter] === options.value) {
        return categories;
    }

    let result, property;

    for (property in categories) {
        if (
            Object.prototype.hasOwnProperty.call(categories, property) &&
            (Helpers.isObject(categories[property]) || Array.isArray(categories[property]))
        ) {
            result = getCatalogInfoFromCategories(categories[property], options);

            if (result) {
                return result;
            }
        }
    }

    return result;
}

// We prepend targetUrls with /ca/en or /ca/fr so they will be properly matched for Canada URLs
function updateTargetUrl(object) {
    object.targetUrl = urlUtils.getLink(object.targetUrl);
}

function visitCategories(categories, fn) {
    if (Array.isArray(categories)) {
        categories.forEach(category => {
            fn(category);
            visitCategories(category.subCategories, fn);
        });
    }
}

function handleSEOForCanada(data) {
    if (Sephora.isSEOForCanadaEnabled && localeUtils.isCanada()) {
        updateTargetUrl(data);
        visitCategories(data.categories, updateTargetUrl);
    }

    return data;
}

function getPropertyNameFromCategory(category, catalogKeyName) {
    return category[catalogKeyName] || category.categoryId;
}

function getRefinementsFromQueryParams(queryParams) {
    let refinementsIds = [];

    const refinementsInQueryParams = queryParams['ref']?.slice();

    if (refinementsInQueryParams && refinementsInQueryParams.length) {
        if (refinementsInQueryParams.length === 1) {
            refinementsIds = refinementsInQueryParams[0].split(',');
        } else {
            refinementsIds = refinementsInQueryParams;
        }
    }

    return refinementsIds;
}

export default {
    CatalogSortOption,
    getCatalogInfoFromCategories,
    getPropertyNameFromCategory,
    handleSEOForCanada,
    getRefinementsFromQueryParams
};
