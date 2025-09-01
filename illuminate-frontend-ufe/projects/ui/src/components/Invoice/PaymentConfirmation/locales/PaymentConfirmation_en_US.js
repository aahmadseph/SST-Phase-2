const resources = {
    invoiceNumber: 'Invoice Number: ',
    continueShopping: 'Continue Shopping',
    paymentConfirmationTitle: 'We Got It!',
    confirmationEmail: 'You will be receiving a confirmation email.'
};

export default function getResource(label) {
    return resources[label];
}
