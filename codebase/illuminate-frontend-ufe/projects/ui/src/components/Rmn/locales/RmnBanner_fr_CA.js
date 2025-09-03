const resources = {
    sponsored: 'Commandité',
    alt: 'Image de bannière avec contenu sponsorisé',
    featuredProduct: 'Produits en vedette'
};

export default function getResource(label) {
    return resources[label];
}
