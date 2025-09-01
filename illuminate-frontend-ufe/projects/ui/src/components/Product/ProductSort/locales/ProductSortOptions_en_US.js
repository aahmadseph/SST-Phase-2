export default function getResource(label) {
    const resources = {
        recentlyAdded: 'Recently Added',
        brandAZ: 'Brand name A-Z',
        brandZA: 'Brand name Z-A',
        priceLow: 'Price high to low',
        priceHigh: 'Price low to high'
    };

    return resources[label];
}
