export default function getResource(label, vars = []) {
    const resources = {
        shippingAndHandling: 'Shipping & Handling',
        discounts: 'Discounts',
        bagFee: 'Bag fee',
        specialFee: 'Special Fee',
        gstOrHst: 'Estimated GST/HST',
        pst: 'Estimated PST',
        tax: 'Estimated Tax',
        storeCreditRedeemed: 'Account Credit',
        giftCardRedeemed: 'Gift Card Redeemed',
        eGiftCardRedeemed: 'eGift Card Redeemed'
    };

    return resources[label];
}
