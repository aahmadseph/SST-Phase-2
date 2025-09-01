import skuUtils from 'utils/Sku';
import helperUtils from 'utils/Helpers';
import anaUtils from 'analytics/utils';
const { formatSiteCatalystPrice } = helperUtils;

class OrderBindingUtils {
    static getPriceForProductString = item => {
        if (!skuUtils.isGiftCard(item.sku)) {
            if (skuUtils.isSample(item.sku) || skuUtils.isBiReward(item.sku)) {
                return '0';
            } else {
                let itemPrice;

                if (item.isReplenishment) {
                    itemPrice = formatSiteCatalystPrice(item.sku.listPrice);
                } else {
                    itemPrice = item.salePriceSubtotal || item.listPriceSubtotal;
                }

                return anaUtils.removeCurrencySymbol(itemPrice);
            }
        } else {
            return '';
        }
    };
}

export default OrderBindingUtils;
