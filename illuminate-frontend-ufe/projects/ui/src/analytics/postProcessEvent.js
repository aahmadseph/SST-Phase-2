/**
 * Purpose: Handles things that need to happen after a particular event has occured.
 */

import anaConsts from 'analytics/constants';
import Storage from 'utils/localStorage/Storage';
import StorageConst from 'utils/localStorage/Constants';
import processEvent from 'analytics/processEvent';
import anaUtils from 'analytics/utils';

export default function (eventName, data = {}) {
    const promises = Sephora.analytics.promises;
    const pageType = digitalData.page.category.pageType;
    const fireEventForTMS = anaUtils.fireEventForTagManager;
    const isCategoryPage =
        pageType === anaConsts.PAGE_TYPES.ROOTCATEGORY ||
        pageType === anaConsts.PAGE_TYPES.NTHCATEGORY ||
        pageType === anaConsts.PAGE_TYPES.TOPCATEGORY;

    const fireEventBasedOnData = function (events = []) {
        //Trigger a pixel when a user registers for Beauty Insider
        if (events.indexOf(anaConsts.Event.REGISTRATION_WITH_BI) !== -1) {
            fireEventForTMS(anaConsts.EVENT_NAMES.REGISTERED_FOR_BI);
        }

        if (events.indexOf(anaConsts.QUICK_LOOK_LOAD) !== -1) {
            fireEventForTMS(anaConsts.QUICK_LOOK_LOAD);
        }

        if (events.indexOf(anaConsts.Event.BOOK_RESERVATION_SUCCESS) !== -1 || events.indexOf(anaConsts.Event.RSVP_EVENT_SUCCESS) !== -1) {
            fireEventForTMS(anaConsts.EVENT_NAMES.BOOKED_RESERVATION);
        }
    };

    const fireCategoryPageLoad = () => {
        if (isCategoryPage) {
            fireEventForTMS(anaConsts.CATEGORY_PAGE_LOAD);
        }
    };

    const fireDoubleClickCategoryPage = () => {
        if (isCategoryPage) {
            fireEventForTMS(anaConsts.DOUBLE_CLICK_CATEGORY_PAGE);
        }
    };

    switch (eventName) {
        case anaConsts.PAGE_LOAD:
            digitalData.page.attributes.initialPageLoadDidOccur = true;

            //ILLUPH-82807 - Fire "[PIXEL] DoubleClick Global Footer" 3 seconds after pageLoadEvent
            window.setTimeout(function () {
                fireEventForTMS(anaConsts.DOUBLE_CLICK_FOOTER);
                fireDoubleClickCategoryPage();
            }, 3000);

            fireEventBasedOnData(digitalData.page.attributes.previousPageData.events);

            if (pageType === 'product') {
                const productInfo = Sephora.analytics.utils.safelyReadProperty('digitalData.product.0.productInfo') || {};

                fireEventForTMS(anaConsts.PRODUCT_PAGE_LOAD);
                fireEventForTMS(anaConsts.DOUBLE_CLICK_PRODUCT_PAGE);

                promises.styleHaulReady.then(() => {
                    window.analytics &&
                        // prettier-ignore
                        window.analytics.track('ViewProduct', {
                            'product_name': productInfo.productName,
                            'product_id': productInfo.productID
                        });
                });
            }

            fireCategoryPageLoad();

            //Set a sessionStorage object to identify if a previous page load exists
            Storage.session.setItem(StorageConst.PAGE_LOAD_FLAG, pageType);

            /* Used as a way to trigger Signal tags/pixels that depend on the pageLoad data elements
             ** We're using 'process' to ensure that this won't fire until the pageLoad tag has */
            processEvent.process('postPageLoad', { data: { doesNotTriggerAdobeTag: true } });

            break;

        case anaConsts.ASYNC_PAGE_LOAD:
            if (Array.isArray(data.eventStrings)) {
                fireEventBasedOnData(data.eventStrings);
            }

            if (data.eventName) {
                fireEventBasedOnData([data.eventName]);
            }

            fireCategoryPageLoad();

            break;

        case anaConsts.LINK_TRACKING_EVENT:
            if (Array.isArray(data.eventStrings)) {
                fireEventBasedOnData(data.eventStrings);
            }

            if (data.eventName) {
                fireEventBasedOnData([data.eventName]);
            }

            break;

        default:

        //Do nothing
    }
}
