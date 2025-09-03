
export default function getResource(label, vars = []) {
    const resources = {
        buyItAgain: 'Buy It Again',
        signInMessage: 'You have to sign in to see this page.',
        signInMessageDescription: 'Sign in and discover a new way to organize all your online and in-store purchases.',
        beautyMemberMessage: 'You need to be a Beauty Insider member',
        beautyMemberMessageBr: 'to view your past purchases.',
        signIn: 'Sign In',
        joinNow: 'Join Now',
        purchaseHistorySortDescription: 'purchaseHistorySortDescription',
        sortDescribedById: 'purchaseHistorySortDescription',
        sortDescribedByText: 'Choosing sorting option will automatically update the products that are displayed to match the selected sorting option',
        filterDescribedById: 'purchaseHistoryFilterDescription',
        filterDescribedByText: 'Choosing filter option will automatically update the products that are displayed to match the selected filter option',
        replenItemsCarouselTitle: 'Restock Past Purchases'
    };
    return resources[label];
}
