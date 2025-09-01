export default function getResource(label, vars = []) {
    const resources = {
        paypalAccount: 'PayPal Account',
        removePaypal: 'Remove PayPal'
    };

    return resources[label];
}
