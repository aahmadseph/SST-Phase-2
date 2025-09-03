export default function getResource(label) {
    const resources = {
        creditLimit: 'Limite de crédit :',
        viewDetails: 'Voir les détails',
        continueShoppingButton: 'Continuer à magasiner'
    };

    return resources[label];
}
