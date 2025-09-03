
export default function getResource(label, vars = []) {
    const resources = {
        writeAReview: 'Write a review',
        answerAQuestion: 'Answer a question',
        free: 'FREE',
        qty: 'QTY',
        itemIsNoLongerAvailable: 'Item is no longer available',
        viewFullSize: 'View Full Size',
        shopTheBrand: 'Shop the Brand',
        viewDetails: 'View Details',
        findInStore: 'Find in store',
        viewBrand: 'view brand',
        recentActivity: 'recent activity',
        purchases: 'purchases',
        redeemed: 'Redeemed',
        itemShipToCanada: 'This item cannot be shipped to Canada',
        itemShipToUS: 'This item cannot be shipped to the United States',
        itemSubstituted: 'Item substituted',
        advisorNotes: 'ADVISOR NOTES',
        similarProductsLink: 'View similar products',
        deliveryEvery: 'Delivery Every',
        finalSaleItem: 'Final Sale: No returns or exchanges'
    };
    return resources[label];
}
