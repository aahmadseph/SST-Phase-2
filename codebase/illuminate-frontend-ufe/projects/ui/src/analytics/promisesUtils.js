function resetPromise(globalAnalyticsObject, promiseName) {
    globalAnalyticsObject.promises[promiseName] = new Promise(resolve => {
        globalAnalyticsObject.resolvePromises[promiseName] = resolve;
    });
}

function resetPromises(globalAnalyticsObject) {
    resetPromise(globalAnalyticsObject, 'brazeIsReady');
    resetPromise(globalAnalyticsObject, 'analyticsProductDataReady');
}

export default { resetPromises };
