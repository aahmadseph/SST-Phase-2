import { connect } from 'react-redux';
import { createSelector, createStructuredSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import { customerPreferenceSelector } from 'selectors/user/customerPreferenceSelector';
import BPUtils from 'utils/BeautyPreferences';
import Actions from 'Actions';

const { showInfoModal } = Actions;

const { wrapHOC } = FrameworkUtils;
const getText = localeUtils.getLocaleResourceFile(
    'components/ProductPage/RatingsAndReviews/ReviewsFilters/BeautyPreferencesFilter/locales',
    'BeautyPreferencesFilter'
);

const bpFiltersCategoryMap = {
    cat140006: ['skinType', 'skinConcerns', 'skinTone', 'eyeColor', 'ageRange'], //makeup
    cat150006: ['skinType', 'skinConcerns', 'skinTone', 'ageRange'], //scincare
    cat130038: ['hairColor', 'hairType', 'hairConcerns', 'hairTexture'], //hair
    cat160006: ['fragrancePreferences'] //fragrance
};

const fields = createSelector(
    createStructuredSelector({
        beautyPreferences: localeUtils.getTextFromResource(getText, 'beautyPreferences'),
        modalTitle: localeUtils.getTextFromResource(getText, 'modalTitle'),
        modalBody: localeUtils.getTextFromResource(getText, 'modalBody'),
        buttonText: localeUtils.getTextFromResource(getText, 'buttonText')
    }),
    customerPreferenceSelector,
    (_state, ownProps) => ownProps,
    (localization, customerPreference, ownProps) => {
        const { categoryId, categoryName, reviewFilters } = ownProps;
        const refinementsByCategory = BPUtils.getMasterListRefinementsByCategory(categoryId);
        const categoryFilters = refinementsByCategory.filter(
            item => bpFiltersCategoryMap[categoryId].includes(item.key) && reviewFilters.find(filter => filter.id === item.key)
        );

        const filterOptions = {};

        categoryFilters.forEach(categoryFilter => {
            //remove items that in master list have filterable: false
            categoryFilter.items = categoryFilter.items.filter(item => item.filterable);

            //when there is no filterable items in master list, don't show this filter
            if (categoryFilter.items.length === 0) {
                return;
            }

            //get user selected BP for every category
            const userCategoryFilter = customerPreference[categoryName][categoryFilter.key].filter(
                item => !/notSure|notSureSc|notSureHc/.test(item) //remove options that shouldn't be shown
            );

            //get filter values for every user BP filter from master list
            if (Array.isArray(userCategoryFilter)) {
                filterOptions[categoryFilter.key] = userCategoryFilter.map(item => {
                    return categoryFilter.items.find(filterOption => filterOption.key === item)?.value || '';
                });
            } else {
                filterOptions[categoryFilter.key] = [categoryFilter.items.find(item => item.key === userCategoryFilter)?.value || ''];
            }
        });

        const isNoOptions = Object.values(filterOptions).flat().length === 0;

        return {
            localization,
            filterOptions,
            isNoOptions
        };
    }
);

const functions = {
    showInfoModal
};

const withBeautyPreferencesFilterProps = wrapHOC(connect(fields, functions));

export {
    fields, functions, withBeautyPreferencesFilterProps
};
