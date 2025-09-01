export default function getResource(label, vars = []) {
    const resources = {
        taxModalTitle: 'Taxes estimées',
        taxModalText: 'La taxe finale sera calculée au moment du paiement, conformément aux politiques fiscales locales.',
        gotIt: 'Compris'
    };

    return resources[label];
}
