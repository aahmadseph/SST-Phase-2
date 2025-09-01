module.exports = function getResource (label, vars = []) {
    const resources = {
        confirmBasketUpdateModalTitle: 'Confirmation',
        confirmBasketUpdateModalButtonText: 'Continue',
        sureToContinueMessage: 'Are you sure you want to continue?',
        error: 'Error',
        ok: 'OK',
        autoReplenishTitle: 'Auto-Replenish Can\'t be Added',
        autoReplenishP1: 'Auto-Replenish quantity is limited to 1 per item. This item is already in your Basket under another shipping method.',
        autoReplenishP2: 'To enroll in Auto-Replenish, remove the item from your Basket and return to the product page.',
        gotIt: 'Got It',
        outOfStockTitle: 'Item Out of Stock',
        outOfStockText: 'Sorry, this item is out of stock. It will not be added to your basket.',
        alreadyInCart: 'Hey, it looks like you already have this product in your cart.',
        limitExceededTitle: 'Limit Reached for This Item',
        genericErrorTitle: 'Error',
        samplesError: 'There was a problem adding this sample. Please try again later.'
    };
    return resources[label];
};
