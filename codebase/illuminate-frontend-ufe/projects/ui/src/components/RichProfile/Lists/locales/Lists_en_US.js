export default function getResource(label, vars = []) {
    const resources = {
        loves: 'Loves',
        purchases: 'Purchases',
        keepTrackPastPurchases1: 'Keep track of all your past online and',
        keepTrackPastPurchases2: 'in-store purchases here.',
        needBeautyInsiderToViewPastPurchases1: 'You need to be a Beauty Insider member',
        needBeautyInsiderToViewPastPurchases2: 'to view your past purchases.',
        joinBI: 'Join Beauty Insider',
        inStoreServices: 'In-store Services'
    };
    return resources[label];
}
