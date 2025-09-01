export default function getResource(label, vars = []) {
    const resources = {
        orderDetails: 'Order Details',
        orderHistory: 'View complete order history',
        yourOrderNumber: 'Your order number is',
        confirmationEmail: 'You’ll receive a confirmation email at',
        viewOrderDetails: 'View Order Details',
        continueShopping: 'Continue Shopping',
        successMessage: 'Replacement order has been placed.',
        failureMessage: 'Sorry, this request was declined.',
        failureMessageParagraph1: 'We reviewed your request. Your order is not eligible for a replacement. If you have any questions or need additional assistance, please contact Customer Service.',
        somethingWrong: 'Hmm... Something went wrong.',
        somethingWrongMessage: 'Something went wrong while processing your submission.',
        tryAgain: 'Try Again'
    };

    return resources[label];
}
