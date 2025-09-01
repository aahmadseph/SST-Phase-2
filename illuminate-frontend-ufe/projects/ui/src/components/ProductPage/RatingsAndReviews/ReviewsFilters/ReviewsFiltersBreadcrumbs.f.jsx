/* eslint-disable object-curly-newline */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Link } from 'components/ui';
import StarRating from 'components/StarRating/StarRating';
import Chiclet from 'components/Chiclet/Chiclet';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/ReviewsFilters/locales', 'ReviewsFilters');

function ReviewsFiltersBreadcrumbs({ selectedFilters = {}, onRemoveChiclet, skuAggregatedList, onClearAllFilters }) {
    const selectedFiltersKey = Object.keys(selectedFilters);
    const isBeautyMatchesOnly = selectedFiltersKey.includes('beautyMatches') && selectedFiltersKey.length === 1;

    return selectedFiltersKey.length > 0 ? (
        <Flex
            width='100%'
            flexWrap='wrap'
            order={1}
            marginTop={1}
        >
            {selectedFiltersKey.map(filterKey =>
                selectedFilters[filterKey].map(optionValue => {
                    // we don't have a requirement to render Chiclet for a beautyMatches
                    if (filterKey === 'beautyMatches') {
                        return null;
                    }

                    const filterValue = optionValue;
                    let label =
                        filterKey === 'rating' ? (
                            <StarRating
                                key={optionValue}
                                rating={parseInt(optionValue)}
                            />
                        ) : (
                            optionValue
                        );

                    if (filterKey === 'sku') {
                        const sku = skuAggregatedList.filter(x => x.skuId === optionValue);

                        if (sku && sku.length) {
                            label = `${sku[0].variationValue || ''} ${sku[0].variationDesc ? `- ${sku[0].variationDesc}` : ''}`;
                        }
                    }

                    return (
                        <Chiclet
                            data-at={Sephora.debug.dataAt('filter_chiclet')}
                            key={`${filterKey}_${optionValue}`}
                            onClick={() => onRemoveChiclet(filterKey, filterValue)}
                            showX={true}
                            marginTop={2}
                            marginRight={2}
                            maxWidth='16ch'
                            children={label}
                        />
                    );
                })
            )}
            {isBeautyMatchesOnly || (
                <Link
                    data-at={Sephora.debug.dataAt('clear_all_link')}
                    onClick={() => onClearAllFilters()}
                    color='blue'
                    marginTop={2}
                >
                    {getText('clearAll')}
                </Link>
            )}
        </Flex>
    ) : null;
}

export default wrapFunctionalComponent(ReviewsFiltersBreadcrumbs, 'ReviewsFiltersBreadcrumbs');
