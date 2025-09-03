export default function getResource(label, vars = []) {
    const resources = {
        modifySubscription: 'Unable to Make Changes',
        errorMessage: 'Your order is processing. You may make changes to your subscription’s next shipment after your current order has processed. Typically in a few hours.',
        done: 'Done'
    };

    return resources[label];
}
