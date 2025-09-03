import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import * as RwdBasketConst from 'constants/RwdBasket';
const {
    DELIVERY_METHOD_TYPES: { BOPIS, SAMEDAY, AUTOREPLENISH, STANDARD }
} = RwdBasketConst;

const { ASYNC_PAGE_LOAD, LINK_TRACKING_EVENT, DELIVERY_OPTIONS_MAP } = anaConsts;

const DELIVERY_METHOD_REMAP = {
    ['standard']: STANDARD,
    ['Sameday']: SAMEDAY,
    ['Pickup']: BOPIS,
    ['AutoReplenish']: AUTOREPLENISH
};

class RewardFulfillmentMethodModalBindings {
    static triggerAnalytics = (type, analyticsData) => {
        const payload = {
            data: { ...analyticsData }
        };
        processEvent.process(type, payload);
    };

    static pageLoad = sku => {
        const anaData = {
            pageName: anaConsts.PAGE_NAMES.REWARD_FULFILLMENT_METHOD_MODAL,
            productStrings: `;${sku};;;;eVar26=${sku}`
        };

        RewardFulfillmentMethodModalBindings.triggerAnalytics(ASYNC_PAGE_LOAD, anaData);
    };

    static confirmMethodModal = ({ method = '', skuId }) => {
        const productStrings = () => {
            return `;${skuId};;;;eVar26=${skuId}|eVar133=${(DELIVERY_METHOD_REMAP[method] || method)?.toLowerCase()}`;
        };

        const eventData = {
            productStrings: productStrings(),
            actionInfo: `choose method:${DELIVERY_OPTIONS_MAP[method] || ''}` //prop55
        };

        RewardFulfillmentMethodModalBindings.triggerAnalytics(LINK_TRACKING_EVENT, eventData);
    };
}

export default RewardFulfillmentMethodModalBindings;
