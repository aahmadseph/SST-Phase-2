import addStructureApi from 'services/api/thirdparty/AddStructure';
import store from 'Store';
import Services from 'utils/Services';
import skuUtils from 'utils/Sku.js';
import UtilActions from 'utils/redux/Actions';

export default function () {
    /* Stop service from loading if not necessary */
    if (!Services.shouldServiceRun.addStructure()) {
        return;
    }

    const selectedSkuId = skuUtils.getProductPageData();

    const skuId = (selectedSkuId && selectedSkuId.skuId) || (Sephora.productPage && Sephora.productPage.defaultSkuId);

    if (skuId) {
        addStructureApi
            .getSeoLinks(skuId)
            .then(resp => {
                store.dispatch(UtilActions.merge('page.product', 'relatedLinks', resp.related));
            })
            .catch({
                /* Handle exception */
            });
    }
}
