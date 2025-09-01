/* eslint-disable no-console */
import anaConsts from 'analytics/constants';
import pageLoadEvent from 'analytics/bindings/pages/all/pageLoadEvent';
import asyncPageLoadEvent from 'analytics/bindings/pages/all/asyncPageLoadEvent';
import linkTrackingEvent from 'analytics/bindings/pages/all/linkTrackingEvent';
import sotLinkTrackingEvent from 'analytics/bindings/pages/all/sotLinkTrackingEvent';
import sotCSFTrackingEvent from 'analytics/bindings/pages/all/sotCSFTrackingEvent';
import sotP13NTrackngEvent from 'analytics/bindings/pages/all/sotP13NTrackngEvent';
import productPageLoad from 'analytics/bindings/pages/product/productPageLoad';
import orderConfirmationPageLoad from 'analytics/bindings/pages/orderConfirmation/orderConfirmationPageLoad';
import unsubscribeQuestionPageLoad from 'analytics/bindings/pages/unsubscribeQuestion/unsubscribeQuestionPageLoad';
import frictionlessCheckoutPageLoad from 'analytics/bindings/pages/frictionlessCheckout/frictionlessCheckoutPageLoad';

export default (function () {
    /**
     * Determine which binding methods we need.
     * @param  {string} pageType  The current page type
     * @param  {string} eventName The name of this event
     * @return {array}  data Additional data to help determine which bindings to use
     */
    // eslint-disable-next-line complexity
    var getBindingMethods = function (pageType, eventName, data = {}) {
        var methodsToCallOnEvent = [];

        // eslint-disable-next-line no-param-reassign
        pageType = (pageType || '').toLowerCase();

        /* Add binding methods that happen on any page load. Any undesired result
         ** from this can be overwritten by more specific bindings. */
        switch (eventName) {
            case anaConsts.PAGE_LOAD:
                //If there were any initialLoadDependencies, run/check them before all else
                methodsToCallOnEvent = Sephora.analytics.initialLoadDependencies;
                methodsToCallOnEvent.push(pageLoadEvent);

                break;
            case anaConsts.ASYNC_PAGE_LOAD:
                methodsToCallOnEvent.push(asyncPageLoadEvent);

                break;

            case anaConsts.LINK_TRACKING_EVENT:
                methodsToCallOnEvent.push(linkTrackingEvent);

                break;

            case anaConsts.SOT_LINK_TRACKING_EVENT:
                methodsToCallOnEvent.push(sotLinkTrackingEvent);

                break;

            case anaConsts.SOT_CSF_TRACKING_EVENT:
                methodsToCallOnEvent.push(sotCSFTrackingEvent);

                break;

            case anaConsts.SOT_P13N_TRACKING_EVENT:
                methodsToCallOnEvent.push(sotP13NTrackngEvent);

                break;

            default:
                break;
        }

        //Add any binding methods that were passed in
        if (data.bindingMethods) {
            methodsToCallOnEvent = methodsToCallOnEvent.concat(data.bindingMethods);
        }

        //Add page specific PAGE LOAD bindings and promises
        if (eventName === anaConsts.PAGE_LOAD) {
            if (pageType === 'product/productpage' || pageType === 'product') {
                methodsToCallOnEvent.push(Sephora.analytics.promises.analyticsProductDataReady);
                methodsToCallOnEvent.push(productPageLoad);
            } else if (pageType === 'checkout/confirmation' || pageType === 'checkout') {
                methodsToCallOnEvent.push(orderConfirmationPageLoad);
            } else if (
                pageType === 'reviews' ||
                pageType === 'product/productreviewspage' ||
                pageType === 'product/submitquestion' ||
                pageType === 'product/submitanswer'
            ) {
                methodsToCallOnEvent.push(Sephora.analytics.promises.productDataReady);
            } else if (pageType === 'product/unsubscribequestion') {
                methodsToCallOnEvent.push(unsubscribeQuestionPageLoad);
            } else if (pageType === 'contentstore/contentstorenonav') {
                methodsToCallOnEvent.push(linkTrackingEvent);
            } else if (pageType === 'checkout/fscheckout') {
                methodsToCallOnEvent.push(frictionlessCheckoutPageLoad);
            }
        }

        return methodsToCallOnEvent;
    };

    return getBindingMethods;
}());
