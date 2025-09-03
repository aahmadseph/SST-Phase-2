export default function getResource(label, vars = []) {
    const resources = {
        addFullSize: 'Ajouter le produit en format standard',
        addToBasket: 'Ajouter au panier',
        add: 'Ajouter',
        remove: 'Retirer',
        viewLarger: 'Agrandir',
        free: 'Gratuit'
    };

    return resources[label];
}
