export default function getResource(label, vars = []) {
    const resources = {
        paypalAccount: 'Compte PayPal',
        removePaypal: 'Supprimer PayPal'
    };

    return resources[label];
}
