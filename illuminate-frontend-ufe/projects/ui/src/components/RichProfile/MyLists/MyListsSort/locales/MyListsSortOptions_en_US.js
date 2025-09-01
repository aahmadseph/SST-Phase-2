export default function getResource(label) {
    const resources = {
        recentlyAdded: 'Recently Added',
        brandAZ: 'Brand Name A-Z',
        brandZA: 'Brand Name Z-A',
        priceLow: 'Price High to Low',
        priceHigh: 'Price Low to High',
        topRated: 'Top Rated'
    };

    return resources[label];
}
