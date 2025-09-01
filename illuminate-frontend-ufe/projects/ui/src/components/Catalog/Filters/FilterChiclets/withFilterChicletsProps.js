import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;

import { isShopYourStoreFilterEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreFilterEnabledSelector';

const fields = createSelector(
    (_state, ownProps) => ownProps.showUpperFunnelChiclets,
    isShopYourStoreFilterEnabledSelector,
    (showUpperFunnelChiclets, isShopYourStoreFilterEnabled) => {
        return {
            showUpperFunnelChiclets: showUpperFunnelChiclets && isShopYourStoreFilterEnabled
        };
    }
);

const withFilterChicletsProps = wrapHOC(connect(fields));

export {
    fields, withFilterChicletsProps
};
