export default function getResource(label, vars = []) {
    const resources = {
        continueShopping: 'Continuer à magasiner',
        closeButton: 'Fermer les modalités'
    };
    return resources[label];
}
