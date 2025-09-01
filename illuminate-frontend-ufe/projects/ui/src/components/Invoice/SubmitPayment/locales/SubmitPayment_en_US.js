export default function getResource(label) {
    const resources = {
        invoiceTotal: 'Invoice Total: ',
        submitPayment: 'Submit Payment'
    };

    return resources[label];
}
