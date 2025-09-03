export default function getResource(label, vars = []) {
    const resources = {
        paymentModalTitle: 'Payment',
        paymentModalText: 'You will pay for your reserved items at the time of pickup, like you normally would for in-store purchases. See ',
        paymentMethods: 'Payment Methods',
        forMoreDetails: ' for more details.',
        gotIt: 'Got It'
    };

    return resources[label];
}
