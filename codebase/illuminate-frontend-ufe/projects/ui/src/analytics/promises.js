/**
 * Create globally accessible promises that can be resolved from anywhere, including Signal.
 *
 * These promises represent the major dependencies that all other analytics
 * event rely on.
 */
export default (function () {
    return globalAnalyticsObject => {
        const customPromises = {};

        const promiseNames = [
            /**
             * Wait for Signal (our tag management system) to be ready before firing events to it
             * Resolve: Called from Signal tag "Tag Management System Ready", firing rules
             */
            'tagManagementSystemReady',

            /**
             * Used to wait for the appMeasurement module of the s_code to be ready, so that we
             * subscribe to its callbacks and throttle our calls so they don't overwrite each
             * other's data.
             * Resolve: Called from the s_code library in Signal
             */
            'appMeasurementReady',

            /* Snapchat */
            'snapChatReady',

            'styleHaulReady',

            'brazeIsReady',

            /* GA4 */
            'ga4Ready',

            /**
             * Wait for product data to be ready
             */
            'productDataReady',
            'PinterestBasePixelInitialized',

            'analyticsProductDataReady'
        ];

        for (const name of promiseNames) {
            globalAnalyticsObject.promises[name] = new Promise(resolve => {
                globalAnalyticsObject.resolvePromises[name] = resolve;
            });
        }

        //Setup methods to dynamically add promises later
        globalAnalyticsObject.promises.createCustomPromise = function (name, callback) {
            customPromises[name] = new Promise(function (resolve, reject) {
                callback(resolve, reject);
            });

            return customPromises[name];
        };

        globalAnalyticsObject.promises.getCustomPromise = function (name) {
            return customPromises[name];
        };

        return globalAnalyticsObject;
    };
}());
