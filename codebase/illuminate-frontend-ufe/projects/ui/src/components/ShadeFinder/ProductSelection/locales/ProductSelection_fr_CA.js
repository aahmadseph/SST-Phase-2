export default function getResource(label, vars = []) {
    const resources = { selectProduct: 'Sélectionnez votre produit actuel pour' };

    return resources[label];
}
