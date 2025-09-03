import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
const { PAGE_NAMES } = anaConsts;

const LABELS_MAP = {
    shopMyStore: PAGE_NAMES.SHOP_YOUR_STORE,
    shopSameDay: PAGE_NAMES.SHOP_SAME_DAY,
    storeDetails: 'store details',
    findASephora: 'find a sephora',
    servicesAndEvents: 'services and events'
};
const SHOP_STORE = 'shop-store';
const SHOP_SAMEDAY = 'shop-sameday';

class ShopYourStoreBindings {
    static setChicletNextPageData() {
        const nextPageData = {
            // prop55 and eVar64
            linkData: 'top nav - my store click',
            navigationInfo: anaUtils.buildNavPath(['top nav', 'my store'])
        };

        anaUtils.setNextPageData(nextPageData);
    }

    static setFlyoutNextPageData(elementId) {
        if (!elementId) {
            return;
        }

        const labelName = LABELS_MAP[elementId] || elementId;

        const nextPageData = {
            // linkData - prop55 for next page load
            linkData: `shop store fly out:${labelName} click`
        };

        anaUtils.setNextPageData(nextPageData);
    }

    static shopSameDayPageLoad(sameDayAvailable) {
        const payload = {
            data: {
                pageName: `happening at sephora:shop-same-day-delivery:n/a:*sdd=${sameDayAvailable}`
            }
        };

        processEvent.process(anaConsts.PAGE_LOAD, payload);
    }

    static shopMyStorePageLoad(isBopisable) {
        const payload = {
            data: {
                pageName: `happening at sephora:shop-your-store:n/a:*pickup=${isBopisable}`
            }
        };

        processEvent.process(anaConsts.PAGE_LOAD, payload);
    }

    static buildInternalCampaignString(item, sectionTitle) {
        const sid = item?.sid;
        const title = item?.title;
        let source = '';

        if (sid.startsWith(SHOP_STORE)) {
            source = LABELS_MAP['shopMyStore'];
        } else if (sid.startsWith(SHOP_SAMEDAY)) {
            source = LABELS_MAP['shopSameDay'];
        }

        const result = encodeURIComponent(`${source}:${sectionTitle}:${title} click`.toLowerCase());

        return result;
    }
}

export default ShopYourStoreBindings;
