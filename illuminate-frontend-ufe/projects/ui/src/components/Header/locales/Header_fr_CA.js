const resources = {
    storesAndServices: 'Magasins et services',
    shopStoreAndDelivery: 'Découvrir le magasin et la livraison',
    chooseYourStore: 'Choisissez votre magasin',
    chooseYourLocation: 'Choisissez votre emplacement',
    chooseYourStoreAndLocation: 'Choisissez votre magasin et votre emplacement',
    home: 'Accueil',
    shop: 'Magasiner',
    offers: 'Offres',
    me: 'Moi',
    signIn: 'Ouvrir une session',
    community: 'Collectivité',
    servicesAndEvents: 'Services et événements',
    store: 'Magasins',
    myStore: 'Mon magasin',
    tooltip: 'Ouvrez une session (ou inscrivez-vous!) pour les offres, les points et plus encore.',
    homepage: 'Page d’accueil Sephora'
};

export default function getResource(label) {
    return resources[label];
}
