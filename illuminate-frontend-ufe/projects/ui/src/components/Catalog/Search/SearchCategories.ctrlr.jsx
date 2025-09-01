/* eslint-disable array-callback-return */

import React from 'react';
import { createRef } from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import mediaUtils from 'utils/Media';
import SearchChiclets from 'components/Catalog/Search/SearchChiclets';
import SearchCategoryList from 'components/Catalog/Search/SearchCategoryList';
import catalogUtils from 'utils/Catalog';
import anaUtils from 'analytics/utils';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';
import { Text } from 'components/ui';

const SELECTED_OPTIONS = {
    parameter: 'isSelected',
    value: true
};

const { Media } = mediaUtils;

class SearchCategories extends BaseClass {
    scrollRef = createRef();

    componentDidUpdate(prevProps) {
        if (prevProps.categories !== this.props.categories && this.scrollRef.current) {
            this.scrollRef.current.scrollLeft = 0;
        }
    }

    getCategories = categories => {
        const urlParams = urlUtils.getParams();
        const isNodeValuePresent = Object.keys(urlParams).includes('node');

        return isNodeValuePresent ? categories?.subCategories : categories;
    };

    setNextPageData = pageName => {
        const { categories = {} } = this.props;
        const navItems = ['left nav'];

        if (categories?.length === 1) {
            navItems.push(categories[0].displayName);
        }

        if (categories[0]?.subCategories?.length === 1) {
            navItems.push(categories[0]?.subCategories[0].displayName);
        }

        navItems.push(pageName);
        anaUtils.setNextPageData({
            navigationInfo: anaUtils.buildNavPath(navItems, 5)
        });
    };

    render() {
        const { categories } = this.props;

        const currentCategory = (categories && catalogUtils.getCategoryInfoFromCategories(categories, SELECTED_OPTIONS)) || {};

        const pageLocation = Location.getLocation(true).href;
        const categoryList = Object.keys(currentCategory).length ? currentCategory : categories;
        const subcategories = this.getCategories(categoryList) || [];
        const { displayName, recordCount } = currentCategory;

        return (
            <>
                {subcategories.length > 0 && (
                    <Media lessThan='md'>
                        <SearchChiclets
                            ref={this.scrollRef}
                            data-at={Sephora.debug.dataAt('search_categories_small_view')}
                            pageLocation={pageLocation}
                            categories={subcategories}
                        />
                    </Media>
                )}
                <Media greaterThan='sm'>
                    <SearchCategoryList
                        data-at={Sephora.debug.dataAt('search_categories_large_view')}
                        categories={subcategories}
                        pageLocation={pageLocation}
                        currentCategory={currentCategory}
                        setNextPageData={this.setNextPageData}
                    />
                    {subcategories.length === 0 && (
                        <Text
                            fontWeight='bold'
                            children={`${displayName}${recordCount ? ` (${recordCount})` : ''}`}
                        />
                    )}
                </Media>
            </>
        );
    }
}

export default wrapComponent(SearchCategories, 'SearchCategories', true);
