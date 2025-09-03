
export default function getResource(label, vars = []) {
    const resources = {
        at: 'at',
        via: 'via',
        noPurchaseHistoryMessage: 'You currently have no Purchase history',
        purchaseBIMessage: 'All purchases made through your Beauty Insider account will automatically appear here.',
        listReferenceMessage: 'Use this list as a reference for all your beauty buys.',
        startShoppingMessage: 'Start Shopping',
        showMoreMessage: 'Show More',
        orderDateDataAt: 'order_date',
        purchasedOnline: 'Purchased online'
    };
    return resources[label];
}
