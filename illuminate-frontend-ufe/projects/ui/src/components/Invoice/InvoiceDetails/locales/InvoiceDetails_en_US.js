export default function getResource(label) {
    const resources = {
        invoiceTo: 'Invoice To:',
        invoiceNumber: 'Invoice Number:',
        invoiceAmount: 'Invoice Amount:',
        invoiceDate: 'Invoice Date:'
    };

    return resources[label];
}
