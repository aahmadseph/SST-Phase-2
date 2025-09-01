export default function getResource(label, vars = []) {
    const resources = {
        acceleratedPromotionTermsText1: `*Offer available to first-time subscribers only. For each Hot Deal item, subscription and quantity is limited to 1 per customer. Discounts expire ${vars[0]} months after the initial sign-up.`,
        acceleratedPromotionTermsText2: `After ${vars[0]} orders at plus-up rate or after ${vars[1]} months of the initial sign-up date, whichever comes first, the subscription renews at a ${vars[2]}% discount.`,
        acceleratedPromotionTermsText3: `Offer ends ${vars[0]}.`
    };

    return resources[label];
}
