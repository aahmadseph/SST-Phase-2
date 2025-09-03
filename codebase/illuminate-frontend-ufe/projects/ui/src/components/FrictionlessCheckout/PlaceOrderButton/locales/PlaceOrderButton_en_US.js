export default function getResource(label, vars = []) {
    const resources = {
        placeOrder: 'Place Order',
        placeKlarnaOrder: 'Continue to Klarna',
        placeAfterpayOrder: 'Continue to Afterpay',
        placePazeOrder: 'Continue to Paze',
        orderTotal: 'Order total',
        item: 'item',
        items: 'items',
        authorizeErrorMessage: `Trouble connecting to ${vars[0]}. Please use a different payment method or try again later.`,
        denialMessage: 'We’re sorry! Klarna payment could not be authorized. Please select a different payment method.',
        maxAuthAmountMessage: `{*}Based on first-choice items. Your payment method will be *temporarily authorized* for *${vars[0]}*. {color:blue}+See full terms.+{color}`,
        placeFreePayment: 'Continue with',
        withText: 'with',
        forProcessingText: 'for',
        placeOrderFor: 'Place order for ',
        processingOrder: 'Processing order, please wait.',
        buttonDisabled: 'Button disabled, complete required fields first.',
        logoAlt: 'logo'
    };

    return resources[label];
}
