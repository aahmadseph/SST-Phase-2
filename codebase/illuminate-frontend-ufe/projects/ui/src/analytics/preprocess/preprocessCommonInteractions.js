import anaConsts from 'analytics/constants';
import utils from 'analytics/utils';

import quickLookInteraction from 'analytics/bindings/pages/all/quickLookInteraction';
import addSampleToBasket from 'analytics/bindings/pages/basket/addSampleToBasket';
import addRewardToBasket from 'analytics/bindings/pages/basket/addRewardToBasket';
import addReplenProduct from 'analytics/bindings/pages/basket/addReplenProduct';
import addSDUProduct from 'analytics/bindings/pages/basket/addSDUProduct';
import addRRCFromBannerToBasket from 'analytics/bindings/pages/basket/addRRCFromBannerToBasket';

const {
    CONTEXT: {
        BASKET_LOVES,
        BASKET_PRODUCT,
        BASKET_REWARDS,
        BASKET_SAMPLES,
        CONTENT_STORE,
        QUICK_LOOK,
        REPLEN_PRODUCT,
        SAME_DAY_UNLIMITED,
        ROUGE_REWARD_CARD_BANNER
    },
    PAGE_DETAIL: { MY_LISTS },
    Event: { ATB_FROM_BASKET_LOVE_CAROUSEL },
    LINK_TRACKING_EVENT
} = anaConsts;

function AddBindings(data) {
    const addBindingMethods = function (methodsToAdd) {
        const existingMethods = data.bindingMethods || [];

        /* Order of binding methods matters. The base method should happen first because
         ** subsequent methods extend the originals. This is why we do existing.concat(new) */
        data.bindingMethods = existingMethods.length ? existingMethods.concat(methodsToAdd) : methodsToAdd;
    };

    switch (data.context) {
        case QUICK_LOOK: {
            addBindingMethods([quickLookInteraction]);

            break;
        }
        case BASKET_SAMPLES: {
            addBindingMethods([addSampleToBasket]);

            break;
        }
        case BASKET_REWARDS: {
            addBindingMethods([addRewardToBasket]);

            break;
        }
        case BASKET_LOVES: {
            addBindingMethods(function () {
                const currentEvent = utils.getMostRecentEvent(LINK_TRACKING_EVENT);
                data.eventStrings = currentEvent.eventInfo.attributes.eventStrings || [];
                data.eventStrings.push(ATB_FROM_BASKET_LOVE_CAROUSEL);

                Object.assign(currentEvent.eventInfo.attributes.eventStrings, data.eventStrings);
            });

            break;
        }
        case REPLEN_PRODUCT: {
            addBindingMethods([addReplenProduct]);

            break;
        }
        case SAME_DAY_UNLIMITED: {
            addBindingMethods([addSDUProduct]);

            break;
        }
        case BASKET_PRODUCT: {
            addBindingMethods(function () {
                const {
                    eventInfo: { attributes }
                } = utils.getMostRecentEvent(LINK_TRACKING_EVENT);

                attributes.addToBasketLocation = `${data.context}`;

                if (data?.analyticsData?.displayQuantityPickerInATB) {
                    attributes.productStrings = data?.analyticsData?.productStrings[0] + `|eVar72=${attributes.addToBasketLocation}`;
                } else {
                    attributes.productStrings += `|eVar72=${attributes.addToBasketLocation}`;
                }
            });

            break;
        }
        case ROUGE_REWARD_CARD_BANNER: {
            addBindingMethods([addRRCFromBannerToBasket]);

            break;
        }
        case CONTENT_STORE: {
            addBindingMethods(function () {
                const currentEvent = utils.getMostRecentEvent(LINK_TRACKING_EVENT);
                currentEvent.eventInfo.attributes.biRewardType = data.sku.biType;
            });

            break;
        }
        default: {
            //Do nothing
        }
    }
}

/**
 * Determine how to bind data for an event based on the context in the parameter
 * Common interactions preprocessed here include:
 * - Add to Basket
 * - Love / Un-Love
 * - Swatch Click
 * @param  {object} data An object containing specifics for this event
 */
export default function (data) {
    const processEvent = require('analytics/processEvent').default;

    AddBindings(data);

    /* Use originalContext for cases when we shouldn't grab the data from current context but another one
     ** For example when a 2nd level Modal does not trigger an s.t call
     ** we should grab the data from the 1st level modal (if it had an s.t call) */
    const currentEventData = utils.getLastAsyncPageLoadData({ pageType: data.originalContext || data.context });
    const anaObj = {
        ...data,
        ...currentEventData
    };
    const anaObjPageName = anaObj.pageName;

    if ((data.originalContext === 'preCheckoutModal' && data.analyticsData.pageName) || (data.context === MY_LISTS && !anaObjPageName)) {
        anaObj.pageName = data.analyticsData.pageName;
    }

    // Verifies the page name is available for the product page add to basket event
    if (data.context === 'product' && !anaObjPageName) {
        anaObj.pageName = digitalData?.page?.attributes?.sephoraPageInfo?.pageName;
    }

    // Verifies the page name is available for the product page add to basket event
    // when changing swatches and selecting BOPIS delivery
    if (data.context === 'product' && !anaObjPageName && data.pageName) {
        anaObj.pageName = data.pageName;
    }

    processEvent.process(LINK_TRACKING_EVENT, { data: anaObj });
}
