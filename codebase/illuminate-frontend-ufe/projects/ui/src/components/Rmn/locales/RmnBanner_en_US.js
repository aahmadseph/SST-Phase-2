const resources = {
    sponsored: 'Sponsored',
    alt: 'Image de bannière avec contenu sponsorisé',
    featuredProduct: 'Featured Products'
};

export default function getResource(label) {
    return resources[label];
}
