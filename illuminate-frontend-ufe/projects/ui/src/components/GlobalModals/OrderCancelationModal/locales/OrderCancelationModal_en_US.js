export default function getResource(label, vars = []) {
    const resources = {
        orderCancelationTitle: 'Order Cancelation',
        cancelationReason: 'Reason for cancelation:',
        enterReasonHere: 'Enter your cancelation reason here',
        reasonTextError: 'Please enter your cancellation reason.',
        continueShopping: 'Continue shopping',
        title: 'Order Cancelation',
        cancelOrderButton: 'Submit & Cancel Order',
        messageFailure: `Sorry, we are not able to cancel your order at this time. [Contact us|${vars[0]}] if you need any help.`,
        buttonText: 'OK'
    };

    return resources[label];
}
