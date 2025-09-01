/* eslint-disable array-callback-return */

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import Location from 'utils/Location';

import mediaUtils from 'utils/Media';
import { Text } from 'components/ui';
import CategoryChiclets from 'components/Catalog/Categories/CategoryChiclets/CategoryChiclets';
import CategoryList from 'components/Catalog/Categories/CategoryList/CategoryList';
import catalogUtils from 'utils/Catalog';
import anaUtils from 'analytics/utils';

import languageLocaleUtils from 'utils/LanguageLocale';
const { getLocaleResourceFile } = languageLocaleUtils;
const getText = getLocaleResourceFile('components/Catalog/locales', 'Catalog');
import { PAGE_TYPES } from 'utils/CatalogConstants';
const SELECTED_OPTIONS = {
    parameter: 'isSelected',
    value: true
};

const { Media } = mediaUtils;

class Categories extends BaseClass {
    constructor(props) {
        super(props);
        const currentCategory = (this.props.categories && catalogUtils.getCategoryInfoFromCategories(this.props.categories, SELECTED_OPTIONS)) || {};
        this.state = {
            currentCategory,
            currentLevel: currentCategory.level
        };
        this.result = {
            prev: '',
            lastSubCategories: ''
        };
    }

    componentDidUpdate(prevProps) {
        if (prevProps.categories !== this.props.categories) {
            const currentCategory =
                (this.props.categories && catalogUtils.getCategoryInfoFromCategories(this.props.categories, SELECTED_OPTIONS)) || {};

            this.setState({
                currentCategory,
                currentLevel: currentCategory.level
            });
        }
    }
    isCurrentPage = element => {
        const { categoryId } = this.props;

        if (Location.isBrandNthCategoryPage()) {
            return element.nodeValue === categoryId || element.nodeStr === categoryId;
        } else {
            return element.categoryId === categoryId;
        }
    };

    getNthLevelCategories = categories => {
        if (!categories || !categories.length) {
            return [];
        }

        let findCurrentCategory;

        categories.map(item => {
            if (this.props.pageType === PAGE_TYPES.TOP_CATEGORY && Location.isBrandNthCategoryPage()) {
                this.result.lastSubCategories = categories;
            } else if (this.props.pageType === PAGE_TYPES.TOP_CATEGORY && Location.isNthCategoryPage()) {
                this.result.lastSubCategories = item.subCategories;
            } else {
                if (this.props.pageType === PAGE_TYPES.NTH_CATEGORY_PAGE) {
                    findCurrentCategory = item.subCategories?.find(this.isCurrentPage);
                }

                if (findCurrentCategory === undefined) {
                    if (item.subCategories) {
                        this.result.prev = item.subCategories;
                        this.getNthLevelCategories(item.subCategories);
                    } else {
                        this.result.lastSubCategories = this.result.prev;
                    }
                } else {
                    this.result.lastSubCategories = item.subCategories;
                }
            }
        });

        return this.result.lastSubCategories;
    };

    setNextPageData = nthCategory => {
        const { categories = {}, isBottom } = this.props;
        const navItems = isBottom ? ['hardlinks nav bottom'] : ['left nav'];
        const brand = digitalData.page.attributes.brand;

        if (brand) {
            navItems.push('brands', brand);
        }

        if (categories?.length === 1) {
            navItems.push(categories[0].displayName);
        }

        if (categories[0]?.subCategories?.length === 1) {
            navItems.push(categories[0]?.subCategories[0].displayName);
        }

        navItems.push(nthCategory);
        anaUtils.setNextPageData({
            navigationInfo: anaUtils.buildNavPath(navItems, brand ? 6 : 5)
        });
    };

    render() {
        const { currentCategory = {} } = this.state;
        const subCategories = this.getNthLevelCategories(this.props.categories) || [];
        const {
            title, showHeading, isBottom, parentCategory, pageType
        } = this.props;

        if (subCategories.length === 0) {
            return null;
        }

        const chicletCats = subCategories.filter(category => !category.isSelected);

        if (isBottom) {
            let heading = currentCategory.displayName;

            if (pageType === PAGE_TYPES.NTH_CATEGORY_PAGE && parentCategory?.displayName) {
                heading = parentCategory.displayName;
            }

            return chicletCats.length > 0 ? (
                <>
                    <Text
                        is='h2'
                        fontSize={['lg', 'xl']}
                        lineHeight='tight'
                        marginTop='.5em'
                        marginBottom='.75em'
                        fontWeight='bold'
                        children={`${getText('browseMore')} ${title || heading}`}
                    />
                    <CategoryChiclets
                        isGridView={true}
                        categories={chicletCats}
                        setNextPageData={this.setNextPageData}
                    />
                </>
            ) : null;
        } else {
            return (
                <>
                    {chicletCats.length > 0 && (
                        <Media lessThan='md'>
                            <CategoryChiclets
                                data-at={Sephora.debug.dataAt('categories_small_view')}
                                categories={chicletCats}
                                setNextPageData={this.setNextPageData}
                            />
                        </Media>
                    )}
                    <Media greaterThan='sm'>
                        {showHeading && (
                            <Text
                                is='h2'
                                marginTop={6}
                                marginBottom={3}
                                fontSize='sm'
                                lineHeight='tight'
                                color='gray'
                                children={getText('shopByCategory')}
                            />
                        )}
                        <CategoryList
                            data-at={Sephora.debug.dataAt('categories_large_view')}
                            categories={subCategories}
                            setNextPageData={this.setNextPageData}
                        />
                    </Media>
                </>
            );
        }
    }
}

export default wrapComponent(Categories, 'Categories');
