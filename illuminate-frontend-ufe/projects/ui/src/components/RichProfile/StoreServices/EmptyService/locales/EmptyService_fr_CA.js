export default function getResource(label, vars = []) {
    const resources = {
        productsFromServices: 'Les recommandations du produit de vos services apparaîtront ici.',
        emptyServiceHeaderCopy: 'Il semble que vous n’avez pas encore de recommandations des conseillers beauté.',
        emptyServiceHeaderBody: 'Offrez-vous une séance maquillage personnalisée. Les recommandations du produit de vos services apparaîtront ici.',
        bookReservation: 'Prendre rendez-vous'
    };

    return resources[label];
}
