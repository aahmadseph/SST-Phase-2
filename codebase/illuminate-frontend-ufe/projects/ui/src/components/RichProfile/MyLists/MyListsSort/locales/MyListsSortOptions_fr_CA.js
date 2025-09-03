export default function getResource(label) {
    const resources = {
        recentlyAdded: 'Ajouté récemment',
        brandAZ: 'Marques de A à Z',
        brandZA: 'Marques de Z à A',
        priceLow: 'Par ordre décroissant de prix',
        priceHigh: 'Par ordre croissant de prix',
        topRated: 'Meilleur classement'
    };

    return resources[label];
}
