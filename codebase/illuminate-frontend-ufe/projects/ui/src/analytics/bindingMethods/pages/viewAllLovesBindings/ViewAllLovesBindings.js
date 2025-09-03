import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';

const {
    EVENT_NAMES: { LOVES },
    SOT_LINK_TRACKING_EVENT
} = anaConsts;

class ViewAllLovesBindings {
    static triggerSOTAnalytics = ({ eventName, ...data }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                ...data
            }
        };

        processEvent.process(SOT_LINK_TRACKING_EVENT, eventData);
    };

    static triggerSOTLinkTrackingAnalytics = ({ eventName, ...data }) => {
        const eventData = {
            data: {
                linkName: eventName,
                actionInfo: eventName,
                specificEventName: eventName,
                ...data
            }
        };

        processEvent.process(SOT_LINK_TRACKING_EVENT, eventData);
    };

    static shareClick = () => {
        const { SHARE } = LOVES;
        ViewAllLovesBindings.triggerSOTAnalytics({
            eventName: SHARE
        });
    };

    static formatShareableLists = lists => {
        if (!lists?.length) {
            return null;
        }

        const fields = ['shoppingListItemsCount', 'shoppingListName', 'isDefault', 'shoppingListId'];

        return fields.reduce(
            (acc, field) => ({
                ...acc,
                [field]: lists.map(item => item[field]).join(';')
            }),
            {}
        );
    };

    //Trigger add to loves and un love STAG event
    static triggerShareableListSOTAnalytics(linkName, skuId, sku, lovedSkusArr) {
        if (!skuId || !sku || typeof sku !== 'object') {
            return;
        }

        const {
            productId = '',
            productName = '',
            listPrice = '',
            brandName = '',
            categoryName = '',
            variationType = '',
            variationValue = '',
            isNew = '',
            isOutOfStock = ''
        } = sku;

        const shippingCountry = userUtils.getShippingCountry() || {};
        const currency = localeUtils.ISO_CURRENCY[shippingCountry.countryCode] || '';
        const totalBasketCount = basketUtils.getTotalBasketCount();
        const quantity = 1;
        const lovedSkusList = Array.isArray(lovedSkusArr) ? lovedSkusArr.join(';') : '';
        const specificEventName = linkName === 'love' ? anaConsts.EVENT_NAMES.ADD_TO_LOVES : anaConsts.EVENT_NAMES.REMOVE_FROM_LOVES;
        const eventPayload = {
            linkName,
            actionInfo: linkName,
            eventStrings: [anaConsts.Event.EVENT_71, anaConsts.Event.EVENT_27],
            specificEventName,
            skuId,
            productId,
            productName,
            preferredStoreId: userUtils.getPreferredStoreId(),
            preferredZipCode: userUtils.getZipCode(),
            listPrice,
            brandName,
            categoryName,
            currency,
            quantity,
            skuVariationType: variationType,
            skuVariationValue: variationValue,
            isNew,
            isOutOfStock,
            totalBasketCount,
            lovedSkusList
        };

        processEvent.preprocess.commonInteractions(eventPayload);
    }
}

export default ViewAllLovesBindings;
