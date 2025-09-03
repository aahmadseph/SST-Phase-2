export default function getResource(label) {
    const resources = {
        invoice: 'Invoice',
        secure: 'Secure',
        paymentMethod: 'Payment Method',
        billingAddress: 'Billing Address',
        errorTitle: 'Error',
        ok: 'Ok'
    };

    return resources[label];
}
