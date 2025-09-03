export default function getResource(label, vars = []) {
    const resources = {
        estimatedTotalXItems: `Estimated Total (${vars[0]} items)`,
        estimatedTotal: 'Estimated Total',
        shippingAndTaxes: 'Shipping and taxes calculated during checkout.',
        bopisTaxes: 'Taxes calculated during checkout.',
        youSave: 'You save',
        sduSavingsUS: '$6.95',
        sduSavingsCA: '$9.95',
        maxAuthAmountMessage: '{*}Based on first-choice items. *Your payment method will be temporarily authorized for an additional amount*. {color:blue}+See full terms.+{color}',
        withSDUUnlimited: 'with Same-Day Unlimited',
        paymentLegal: 'Some payment methods may not be available for certain items or fulfillment methods.',
        supportedPayment: 'Supported Payment Methods',
        sddIncreasedAuthorizationWarning: '{*}Estimated total is based on first-choice items. *Your payment method will be temporarily authorized for an additional amount*, to cover potential item substitutions. You will only be charged for the items you receive. The transaction will be finalized when your order is delivered. Promotions may be removed if item substitutions occur. Your final total will be displayed in your email receipt and Order History. The temporary authorization will be removed by your financial institution 3-5 days after you receive your items. Please contact your financial institution for questions related to temporary authorizations.',
        bopisIncreasedAuthorizationWarning: '{*}Estimated total is based on first-choice items. *Your payment method will be temporarily authorized for an additional amount*, to cover potential item substitutions. You will only be charged for the items you receive. The transaction will be finalized when you pick up the order. Promotions may be removed if item substitutions occur. Your final total will be displayed in your email receipt and Order History. The temporary authorization will be removed by your financial institution 3-5 days after you receive your items. Please contact your financial institution for questions related to temporary authorizations.',
        viewBasketSummary: 'View Basket Summary'
    };

    return resources[label];
}
