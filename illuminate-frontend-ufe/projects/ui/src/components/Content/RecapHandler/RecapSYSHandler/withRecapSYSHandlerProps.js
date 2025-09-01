import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import Location from 'utils/Location';

import ShopMyStoreActions from 'actions/HappeningShopMyStoreActions';

import { shopMyStoreSelector } from 'selectors/page/shopMyStore/shopMyStoreSelector';
import { shopSameDaySelector } from 'selectors/page/shopSameDay/shopSameDaySelector';
import { fields as saleFieldsSelector } from 'components/Content/Recap/RecapProductListSale/withRecapProductListSaleProps';
import { fields as bestsellersFieldsSelector } from 'components/Content/Recap/RecapProductListBestSellers/withRecapProductListBestSellersProps';
import { fields as justArrivedFieldsSelector } from 'components/Content/Recap/RecapProductListJustArrived/withRecapProductListJustArrivedProps';

const storeIdSelector = createSelector(shopMyStoreSelector, shopMyStore => {
    return shopMyStore?.data?.storeDetails?.storeId;
});

const zipCodeSelector = createSelector(shopSameDaySelector, shopSameDay => {
    return shopSameDay?.data?.sameDay?.zipCode;
});

const fields = createSelector(
    bestsellersFieldsSelector,
    justArrivedFieldsSelector,
    saleFieldsSelector,
    storeIdSelector,
    zipCodeSelector,
    (bestsellers, justArrived, sale, storeId, zipCode) => {
        const shouldRender = bestsellers.shouldRender || justArrived.shouldRender || sale.shouldRender;

        /*
        The Browse More Recap section should refresh its content when the user's
        preferred Store or Zip Code changes. We're creating a unique context key here.
        If the contextKey changes, a new API call should be triggered
        to fetch fresh information.
        */
        const watchForChanges = [];

        if (Location.isShopMyStorePage()) {
            watchForChanges.push(storeId);
        } else if (Location.isShopSameDayPage()) {
            watchForChanges.push(zipCode);
        }

        const contextKey = watchForChanges.join('_');

        return {
            shouldRender,
            contextKey
        };
    }
);

const functions = {
    fetchBestsellers: ShopMyStoreActions.fetchBestsellers,
    fetchJustArrived: ShopMyStoreActions.fetchJustArrived,
    fetchSale: ShopMyStoreActions.fetchSale
};

const withRecapSYSHandlerProps = wrapHOC(connect(fields, functions));

export { withRecapSYSHandlerProps };
