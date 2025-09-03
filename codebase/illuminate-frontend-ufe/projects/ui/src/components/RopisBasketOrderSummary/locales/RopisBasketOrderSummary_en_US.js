export default function getResource(label, vars = []) {
    const resources = {
        bopisIncreasedAuthorizationWarning: `{*}Estimated total is based on first-choice items. *Your payment method will be temporarily authorized for ${vars[0]}*, to cover potential item substitutions. You will only be charged for the items you receive. The transaction will be finalized when you pick the order. Promotions may be removed if item substitutions occur. Your final total will be displayed in your email receipt and Order History. The temporary authorization will be removed by your financial institution 3-5 days after you receive your items. Please contact your financial institution for questions related to temporary authorizations.`,
        merchandiseSubtotalText: 'Merchandise Subtotal',
        pickup: 'Pickup',
        free: 'FREE',
        estimatedTaxText: 'Estimated Tax',
        estimatedTaxCA: 'Estimated HST/GST/PST',
        estimatedTotalText: 'Estimated Total',
        paymentText: 'Payment will be collected at the store.',
        reservationDetailsButtonText: 'Continue to Reservation Details',
        completeReservation: 'Complete Reservation',
        bagFeeText: 'Bag Fee',
        specialFeeText: 'Special Fee',
        discountsText: 'Discounts',
        eGiftCardRedeemedText: 'eGift Card Redeemed',
        payPalPaymentText: 'PayPal Payment',
        giftCardRedeemedText: 'Gift Card Redeemed',
        creditCardPaymentText: 'Credit Card Payment',
        storeCredit: 'Store Credit',
        beautyInsiderPoints: 'You will earn Beauty Insider points from this purchase after you pick up the order.',
        orderTotal: 'Order Total',
        gotIt: 'Got It',
        salesTax: 'Sales Tax',
        tax: 'Tax',
        caTax: 'HST/GST/PST',
        pointsUsedInThisOrder: 'Points Used (in this order)'
    };

    return resources[label];
}
