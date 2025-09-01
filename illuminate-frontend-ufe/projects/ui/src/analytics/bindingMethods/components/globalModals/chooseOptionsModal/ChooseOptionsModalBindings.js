import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import PageTemplateType from 'constants/PageTemplateType';
import { COMPONENT_SIDS } from 'constants/ShopYourStore';
import helperUtils from 'utils/Helpers';
import { COMPONENT_SIDS as SIDS } from 'components/GlobalModals/ChooseOptionsModal/constants';
import Empty from 'constants/empty';

const { BASKET_YOUR_SAVED_ITEMS_CAROUSEL } = SIDS;
const { SHOP_MY_STORE_BUY_IT_AGAIN, SHOP_SAME_DAY_BUY_IT_AGAIN, SHOP_MY_STORE_FROM_YOUR_LOVES, SHOP_SAME_DAY_FROM_YOUR_LOVES } = COMPONENT_SIDS;
const { getProp } = helperUtils;

const PLACEMENTS_MAP = {
    [PageTemplateType.MyLists]: 'mylistshomepage',
    [PageTemplateType.MyCustomList]: 'mylistshomepage',
    [PageTemplateType.PurchaseHistory]: 'buyitagain',
    [PageTemplateType.ShopMyStore]: 'sys',
    [PageTemplateType.ShopSameDay]: 'sdd',
    [PageTemplateType.RwdBasket]: 'basketcheckout',
    MY_LISTS_FLYOUT: 'mylistsflyout'
};

const COMPONENTS_MAP = {
    [SHOP_MY_STORE_FROM_YOUR_LOVES]: 'yourlists',
    [SHOP_SAME_DAY_BUY_IT_AGAIN]: 'buyitagain',
    [SHOP_SAME_DAY_FROM_YOUR_LOVES]: 'yourlists',
    [SHOP_MY_STORE_BUY_IT_AGAIN]: 'buyitagain',
    [BASKET_YOUR_SAVED_ITEMS_CAROUSEL]: 'yourloves'
};

const PAGE_NAME = 'page.attributes.sephoraPageInfo.pageName';

class ChooseOptionsModalBindings {
    static getPageName() {
        return `${anaConsts.PAGE_TYPES.ADD_TO_BASKET_MODAL}:${anaConsts.PAGE_DETAIL.CHOOSE_OPTIONS}:${anaConsts.NOT_AVAILABLE}`;
    }

    static getPreviousPageName() {
        try {
            return getProp(digitalData, PAGE_NAME) || Empty.String;
        } catch (error) {
            Sephora.logger.error('Failed to get previous page name:', error);

            return Empty.String;
        }
    }

    static getProductStrings(skuId) {
        return `;${skuId};;;;evar26=${skuId}`;
    }

    static getUniquePlacementName({ placementName, componentName, isInlineLoves }) {
        let uniquePlacementName = isInlineLoves ? PLACEMENTS_MAP.MY_LISTS_FLYOUT : PLACEMENTS_MAP[placementName];

        if (componentName) {
            uniquePlacementName += `-${COMPONENTS_MAP[componentName]}`;
        }

        return `${anaConsts.PAGE_TYPES.ADD_TO_BASKET_MODAL} open:${uniquePlacementName}`;
    }

    static modalOpen = argumentsObj => {
        const { skuId, componentName, isInlineLoves = false } = argumentsObj;
        const placementName = Sephora.pagePath || Empty.String;

        const data = {
            pageName: this.getPageName(),
            productStrings: this.getProductStrings(skuId),
            linkData: this.getUniquePlacementName({ placementName, componentName, isInlineLoves }),
            previousPageName: this.getPreviousPageName()
        };

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data
        });
    };
}

export default ChooseOptionsModalBindings;
