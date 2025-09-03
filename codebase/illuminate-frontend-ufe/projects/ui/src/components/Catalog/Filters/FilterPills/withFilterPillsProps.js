import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import { isShopYourStoreFilterEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreFilterEnabledSelector';

const fields = createSelector(
    (_state, ownProps) => ownProps.showCompactPills,
    isShopYourStoreFilterEnabledSelector,
    (showCompactPills, isShopYourStoreFilterEnabled) => {
        return {
            showSingleFilterPill: isShopYourStoreFilterEnabled,
            showCompactPills: showCompactPills && isShopYourStoreFilterEnabled
        };
    }
);

const withFilterPillsProps = wrapHOC(connect(fields));

export {
    fields, withFilterPillsProps
};
