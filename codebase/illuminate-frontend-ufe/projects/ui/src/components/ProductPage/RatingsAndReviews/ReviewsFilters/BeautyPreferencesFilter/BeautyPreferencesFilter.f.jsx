/* eslint-disable object-curly-newline */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Pill from 'components/Pill';
import BeautyPreferencesTooltip from 'components/ProductPage/RatingsAndReviews/ReviewsFilters/BeautyPreferencesTooltip';

function BeautyPreferencesFilter({ filterIsSelected = {}, applyFilters, filterOptions, isNoOptions, showInfoModal, localization, fireAnalytics }) {
    const handleFilterClick = () => {
        if (isNoOptions) {
            showInfoModal({
                isOpen: true,
                title: localization.modalTitle,
                message: localization.modalBody,
                buttonText: localization.buttonText
            });
            fireAnalytics();
        } else {
            applyFilters(filterOptions);
        }
    };

    return (
        <Pill
            data-at={Sephora.debug.dataAt('filter_pill')}
            isActive={filterIsSelected}
            fontSize='sm'
            onClick={handleFilterClick}
        >
            {localization.beautyPreferences}
            <BeautyPreferencesTooltip isActive={filterIsSelected} />
        </Pill>
    );
}

export default wrapFunctionalComponent(BeautyPreferencesFilter, 'BeautyPreferencesFilter');
