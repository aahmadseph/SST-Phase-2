export default function getResource(label, vars = []) {
    const resources = {
        merchandiseSubtotalText: 'Subtotal',
        pointsUsed: 'Points Used (in this order)',
        discountsText: 'Discounts',
        free: 'FREE',
        tbdText: 'TBD',
        shippingAndHandlingText: 'Shipping',
        autoReplenishSavings: 'Auto-Replenish Savings',
        gstHstText: 'Estimated GST/HST',
        taxText: 'Estimated Tax',
        pickup: 'Pickup',
        bagFee: 'Bag Fee',
        pst: 'Estimated PST',
        storeCreditRedeemed: 'Account Credit',
        giftCardRedeemed: 'Gift Card Redeemed',
        eGiftCardRedeemed: 'eGift Card Redeemed',
        creditCardPayment: 'Credit Card Payment',
        payPalPayment: 'PayPal Payment',
        otherFees: '& Other Fees',
        information: 'information',
        moreInfo: 'More Info'
    };

    return resources[label];
}
