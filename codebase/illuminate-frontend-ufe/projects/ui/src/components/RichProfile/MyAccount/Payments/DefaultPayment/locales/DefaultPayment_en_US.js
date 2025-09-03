export default function getResource(label, vars = []) {
    const resources = {
        deletePaymentOption: 'Delete Payment',
        defaultPayment: 'Default Payment',
        cancel: 'Cancel',
        edit: 'Edit',
        paymentNameAccount: `${vars[0]} Account`
    };

    return resources[label];
}
