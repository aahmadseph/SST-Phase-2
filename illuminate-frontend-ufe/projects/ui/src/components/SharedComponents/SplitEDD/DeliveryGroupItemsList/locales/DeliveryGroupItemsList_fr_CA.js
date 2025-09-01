export default function getResource(label, vars = []) {
    const resources = {
        shipmentNumber: `Colis ${vars[0]} de ${vars[1]}`,
        item: 'Article',
        price: 'Prix',
        qty: 'Qté',
        amount: 'Montant'
    };

    return resources[label];
}
