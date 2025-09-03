export default function getResource(label, vars = []) {
    const resources = {
        storeDetails: 'Store Details',
        inStore: 'In-Store Pickup'
    };
    return resources[label];
}
