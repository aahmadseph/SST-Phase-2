export default function getResource(label, vars = []) {
    const resources = {
        birthdayGift: 'Cadeau d’anniversaire',
        free: 'GRATUIT',
        welcomeKit: 'Trousse de bienvenue',
        rouge: 'Rouge',
        orderFullSizeButton: 'Commander le grand format',
        qty: 'Qté',
        deliveryLabel: 'Livraison chaque'
    };

    return resources[label];
}
