export default function getResource (label, vars = []) {
    const resources = {
        estimatedOrderTotal: 'Estimated Total',
        orderSubTotalWithTax: 'Order Subtotal + Estimated Tax',
        oneTimeReplacementFee: 'One-Time Replacement',
        orderTotal: 'Order Total',
        merchandiseSubtotal: 'Merchandise Subtotal',
        pointsUsed: 'Points Used',
        pointsUsedInThisOrder: 'Points Used (in this order)',
        shippingAndHandling: 'Shipping & Handling',
        shippingAndHandlingInfo: 'Shipping & Handling Information',
        discounts: 'Discounts',
        gstOrHst: 'GST/HST',
        estimatedGstOrHst: 'Estimated GST/HST',
        pst: 'PST',
        estimatedPst: 'Estimated PST',
        tax: 'Tax',
        estimatedTax: 'Estimated Tax',
        storeCreditRedeemed: 'Account Credit',
        giftCardRedeemed: 'Gift Card Redeemed',
        eGiftCardRedeemed: 'eGift Card Redeemed',
        creditCardPayment: 'Credit Card Payment',
        payPalPayment: 'PayPal Payment',
        viewOrCancel: 'To view or cancel your order, go to',
        orderDetails: 'order details',
        pickup: 'Pickup',
        free: 'FREE',
        autoReplenishSavings: 'Auto-Replenish Savings',
        sduBIPointsText: 'You will earn Beauty Insider points once you begin payment on your subscription.',
        sddIncreasedAuthorizationWarning: `{*}Estimated total is based on first-choice items. *Your payment method will be temporarily authorized for ${vars[0]}*, to cover potential item substitutions. You will only be charged for the items you receive. The transaction will be finalized when your order is delivered. Promotions may be removed if item substitutions occur. Your final total will be displayed in your email receipt and Order History. The temporary authorization will be removed by your financial institution 3-5 days after you receive your items. Please contact your financial institution for questions related to temporary authorizations.`
    };

    return resources[label];
}
