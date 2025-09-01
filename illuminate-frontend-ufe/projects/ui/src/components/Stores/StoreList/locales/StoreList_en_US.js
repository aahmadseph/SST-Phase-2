export default function getResource(label, vars = []) {
    const resources = {
        completeStoreList: 'Complete Store List',
        happeningAtSephora: 'Happening at Sephora',
        findASephora: 'Find a Sephora',
        storeLocator: 'Store Locator',
        storeLocations: 'Store Locations'
    };
    return resources[label];
}
