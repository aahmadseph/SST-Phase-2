export default function getResource(label, vars = []) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            privacyPolicy: 'Privacy Policy',
            termsOfUse: 'Terms of Use',
            termsAndConditions: 'Sephora Auto-Replenish Subscription Terms & Conditions',
            forTheSubscription: '. By placing this order, you authorize Sephora to charge your default payment method or another payment method on file on a recurring basis at the frequency and for the products you have selected unless and until you cancel. You acknowledge you can cancel any time via the Auto-Replenish page in My Account.',
            byClickingPlaceOrder: 'By clicking the Place Order button below, you also agree to Sephora\'s ',
            iAgreeToAutoReplenish: 'You Agree to the ',
            andConditionsOfUseHaveRead: ', and acknowledge that you have read the ',
            andText: ' ',
            confirmText: 'I confirm that I have read the scripts in the subscription link ',
            autoReplenishSub: 'Auto-Replenish Subscription',
            consentText: ' to the client and received their verbal consent.'
        };
    } else {
        resources = {
            privacyPolicy: 'Privacy Policy',
            termsOfUse: 'Terms of Use',
            termsAndConditions: 'Sephora Auto-Replenish Subscription Terms & Conditions',
            forTheSubscription: '. By placing this order, I authorize Sephora to charge my default payment method or another payment method on file on a recurring basis at the frequency and for the products I have selected unless and until I cancel. I acknowledge I can cancel any time via the Auto-Replenish page in My Account.',
            byClickingPlaceOrder: 'By clicking the Place Order button below, I also agree to Sephora\'s ',
            iAgreeToAutoReplenish: 'I Agree to the ',
            andConditionsOfUseHaveRead: ', and I acknowledge that I have read the ',
            andText: ' '
        };
    }

    return resources[label];
}
