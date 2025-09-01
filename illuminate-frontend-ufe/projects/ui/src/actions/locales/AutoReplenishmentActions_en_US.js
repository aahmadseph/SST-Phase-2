module.exports = function getResource(label, vars = []) {
    const resources = {
        unsubscribeModalConfirmTitle: 'Unsubscribed',
        unsubscribeModalConfirmMsg: 'You have sucessfully unsubscribed from your Auto-Replenish item.',
        unsubscribeModalConfirmButtonText: 'Done',
        errorMessage: 'Oops! Something went wrong and we were unable to process your changes. Please try again later.',
        manageSubscription: 'Manage Subscription',
        unsubscribeItem: 'Unsubscribe Item',
        updateSubscriptionError: 'Update Subscription',
        pausedSubscriptionModalConfirmTitle: 'Paused Item',
        pausedSubscriptionModalConfirmMsg: 'Your Auto-Replenish item has been paused. You may select resume at any time to resume delivery.',
        pausedSubscriptionModalConfirmButtonText: 'Done',
        skipItemUnavailable: 'Skip Item Unavailable',
        skipedSubscriptionModalConfirmTitle: 'Skipped Item',
        nextShipmentText: 'Your Auto-Replenish item will skip its next shipment and resume on',
        pause: 'Pause',
        getItSoonerUpdateTitle: 'Get It Sooner Subscription Update',
        getItSoonerConfirmationTitle: 'Item Added to Basket',
        getItSoonerConfirmationContent: 'Your item has been added to basket. You will now be taken to basket',
        getItSoonerConfirmButtonText: 'Done',
        resumeItem: 'Resume Item',
        deleteCard: 'Delete Card',
        addNewCard: 'Add New Credit or Debit Card',
        editCard: 'Edit Credit Card or Debit Card',
        pauseItem: 'Pause Item'
    };
    return resources[label];
};
