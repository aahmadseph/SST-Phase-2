export default function getResource(label, vars = []) {
    const resources = {
        loves: 'Favoris',
        purchases: 'Achats',
        keepTrackPastPurchases1: 'Gardez une trace de tous vos achats en ligne et',
        keepTrackPastPurchases2: 'en magasin ici.',
        needBeautyInsiderToViewPastPurchases1: 'Vous devez être membre Beauty Insider',
        needBeautyInsiderToViewPastPurchases2: 'pour consulter vos achats passés.',
        joinBI: 'S’inscrire à Beauty Insider',
        inStoreServices: 'Services en magasin'
    };
    return resources[label];
}
