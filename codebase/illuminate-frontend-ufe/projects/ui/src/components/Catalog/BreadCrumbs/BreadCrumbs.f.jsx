import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Chevron from 'components/Chevron';
import navClickBindings from 'analytics/bindingMethods/pages/all/navClickBindings';
import replaceSpecialCharacters from 'utils/replaceSpecialCharacters';
import { Flex, Link, Text } from 'components/ui';
import { site } from 'style/config';
import urlUtils from 'utils/Url';
import Location from 'utils/Location';
import { SALE_KEYWORDS } from 'constants/Search.js';

import languageLocaleUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('components/Catalog/BreadCrumbs/locales', 'BreadCrumbs');

let breadCrumbStack;

function getDisplayName({ isSale, keyword }) {
    return isSale ? getText('sale') : getText('allKeywordResults', [keyword]);
}

function buildBreadCrumbs(items, findId, pageType, keyword) {
    const queryParams = urlUtils.getParams();
    const nodeVal = queryParams && queryParams.node;
    const isSearchWithCategory = pageType === 'search' && !!nodeVal;
    const shouldAddMoreItems = pageType !== 'search' || isSearchWithCategory;
    const isSale = SALE_KEYWORDS.indexOf(keyword) !== -1;

    if (isSearchWithCategory) {
        breadCrumbStack.push({
            displayName: getDisplayName({
                isSale,
                keyword
            }),
            targetUrl: isSale ? '/sale' : `/search?keyword=${keyword}`
        });
    }

    if (shouldAddMoreItems) {
        if (items?.length === 1 && items[0]?.subCategories !== undefined) {
            breadCrumbStack.push(items[0]);

            if ((findId && items[0].categoryId === findId) || items[0].isSelected) {
                return breadCrumbStack;
            } else {
                buildBreadCrumbs(items[0].subCategories, findId);
            }
        } else {
            const foundItem = items?.find(x => x.categoryId === findId || x.nodeValue === findId || x.nodeStr === findId);

            if (foundItem) {
                breadCrumbStack.push(foundItem);
            }
        }
    }

    return breadCrumbStack;
}

function createBreadcrumbs(items, findId, pageType, keyword) {
    breadCrumbStack = [];

    return buildBreadCrumbs(items, findId, pageType, keyword);
}

function generateRedirectUrl(pageLocation, newLocation) {
    const baseSearchLocation = pageLocation.replace(/&.*/, '');

    if (newLocation) {
        const urlToRedirect = urlUtils.addParam(baseSearchLocation, 'node', newLocation);

        return urlToRedirect;
    }

    return baseSearchLocation;
}

function onClick(e, item, analyticsString, breadcrumbsItems, pageType) {
    e.preventDefault();
    const currentPosition = breadcrumbsItems.indexOf(replaceSpecialCharacters(item.displayName));
    let outputBreadcrumbsItems;

    if (pageType === 'search') {
        //checking if its searchPage and removing all "keyword" results string from array
        //adding all search results as the topCat for searchPage
        const breadCrumbItems = breadcrumbsItems.slice(1, currentPosition + 1);
        outputBreadcrumbsItems = ['all search results', ...breadCrumbItems];
    } else {
        outputBreadcrumbsItems = breadcrumbsItems.slice(0, currentPosition + 1);
    }

    const targetUrl = generateRedirectUrl(item.targetUrl, item.nodeValue || item.nodeStr);
    Location.navigateTo(e, targetUrl);
    navClickBindings.trackNavClick([analyticsString, ...outputBreadcrumbsItems]);
}

function BreadCrumbs(props) {
    const {
        isBottom, categories, categoryId, brand, pageType, keyword
    } = props;
    const categoryItems = createBreadcrumbs(categories, categoryId, pageType, keyword);
    const breadcrumbsItems = categoryItems.map(item => replaceSpecialCharacters(item.displayName));

    if (brand) {
        categoryItems.unshift(brand);
        breadcrumbsItems.unshift(replaceSpecialCharacters(brand.displayName));
    }

    const analyticsString = `breadcrumb nav${isBottom ? ' bottom' : ''}${pageType === 'brand' ? ':brands' : ''}`;

    const breadcrumbs = categoryItems.map((item, index) => {
        const isLastItem = index === categoryItems.length - 1;
        let targetUrl = item.targetUrl;

        if (pageType === 'search' && !isLastItem) {
            const pageLocation = Location.getLocation(true).href;
            targetUrl = urlUtils.removeParam(pageLocation, 'node');
            const nodeValue = item.nodeValue || item.nodeStr;

            if (nodeValue) {
                item.targetUrl = targetUrl = urlUtils.addParam(targetUrl, 'node', nodeValue);
            }
        }

        return (
            <li key={`breadcrumb_${index}_${targetUrl}`}>
                {index > 0 && (
                    <Chevron
                        direction='right'
                        size='.5em'
                        marginX={2}
                    />
                )}
                {(isLastItem || !targetUrl) && (
                    <Text
                        color='black'
                        children={item.displayName}
                    />
                )}
                {!isLastItem && targetUrl && (
                    <Link
                        href={urlUtils.getLink(targetUrl)}
                        onClick={e => onClick(e, item, analyticsString, breadcrumbsItems, pageType)}
                        padding={2}
                        margin={-2}
                        children={item.displayName}
                    />
                )}
            </li>
        );
    });

    return categoryItems.length ? (
        <nav aria-label='Breadcrumb'>
            <Flex
                is='ol'
                flexWrap='wrap'
                fontSize='sm'
                alignItems='center'
                lineHeight='tight'
                color='gray'
                paddingY={2}
                minHeight={isBottom || [40, site.BREADCRUMB_HEIGHT]}
            >
                {breadcrumbs}
            </Flex>
        </nav>
    ) : null;
}

BreadCrumbs.propTypes = {
    isBottom: PropTypes.bool,
    categories: PropTypes.array,
    categoryId: PropTypes.string,
    brand: PropTypes.object,
    pageType: PropTypes.oneOf(['brand', 'search', 'category']),
    keyword: PropTypes.string
};

export default wrapFunctionalComponent(BreadCrumbs, 'BreadCrumbs');
