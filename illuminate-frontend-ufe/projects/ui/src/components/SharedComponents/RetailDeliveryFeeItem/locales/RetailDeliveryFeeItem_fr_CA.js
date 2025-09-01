export default function getResource(label, vars = []) {
    const resources = {
        defaultText: 'Frais de livraison au détail',
        qtyTbd: 'À déterminer',
        retailDeliveryModalTitle: 'Frais de livraison au détail'
    };

    return resources[label];
}
