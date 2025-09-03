/* eslint-disable camelcase */
import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
const { wrapHOC } = FrameworkUtils;
import Empty from 'constants/empty';
import PageTemplateType from 'constants/PageTemplateType';

import { shopMyStoreSelector } from 'selectors/page/shopMyStore/shopMyStoreSelector';
import { shopSameDaySelector } from 'selectors/page/shopSameDay/shopSameDaySelector';
import templateSelector from 'selectors/page/templateInformation/templateSelector';

const fields = createSelector(templateSelector, shopMyStoreSelector, shopSameDaySelector, (template, shopMyStore, shopSameDay) => {
    let saleData = {};

    if (template === PageTemplateType.ShopMyStore) {
        saleData = shopMyStore?.sale || Empty.Object;
    } else if (template === PageTemplateType.ShopSameDay) {
        saleData = shopSameDay?.sale || Empty.Object;
    }

    const skuList = saleData.products || Empty.Array;
    const isLoading = saleData.isLoading ?? true;
    const shouldRender = isLoading || (!isLoading && !!skuList.length);

    return {
        isLoading,
        shouldRender,
        skuList
    };
});

const withRecapProductListSaleProps = wrapHOC(connect(fields, null));

export {
    fields, withRecapProductListSaleProps
};
