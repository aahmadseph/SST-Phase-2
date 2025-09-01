export default function getResource(label) {
    const resources = {
        recentlyAdded: 'Ajouté récemment',
        brandAZ: 'Marques de A à Z',
        brandZA: 'Marques de Z à A',
        priceLow: 'Prix décroissant',
        priceHigh: 'Prix croissant'
    };

    return resources[label];
}
