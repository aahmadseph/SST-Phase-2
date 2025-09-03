import skuUtils from 'utils/Sku';

export default (function () {
    //Methods used for binding data to digitalData properties related double click pixels.
    return {
        getAllowedItems: function (items = []) {
            return items.filter(item => {
                let isAllowedType = false;
                const skuType = item.sku.type.toLowerCase();

                isAllowedType = skuType === skuUtils.skuTypes.STANDARD || (skuType === skuUtils.skuTypes.SUBSCRIPTION && item.sku.skuId === '1001');

                return (
                    isAllowedType &&
                    !skuUtils.isGwp(item.sku) &&
                    !skuUtils.isBiReward(item.sku) &&
                    !skuUtils.isSample(item.sku) &&
                    !skuUtils.isGiftCard(item.sku)
                );
            });
        }
    };
}());
