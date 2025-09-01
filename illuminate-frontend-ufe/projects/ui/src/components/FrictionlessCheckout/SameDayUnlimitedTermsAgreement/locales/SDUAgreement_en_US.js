export default function getResource(label, vars = []) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            // Link text for the terms and conditions
            sduTermsLink: 'Sephora Same-Day Unlimited Subscription Terms & Conditions.',

            // Trial + Auto-Replenish text
            sduAgreementIntro: 'You Agree to the ',
            sduTrialDetailsText: `After your 30-day promotional trial, you authorize Sephora to charge ${vars[0]} to your default payment method or another payment method on file, and you understand that your subscription will automatically renew and you will be charged this amount annually unless and until you cancel. You acknowledge you can cancel any time via the Same-Day Unlimited page in My Account.`,

            // Subscription + Auto-Replenish text
            sduSubscriptionDetailsText: 'By placing this order, you authorize Sephora to charge your default payment method or another payment method on file on a recurring basis at the frequency and for the products you have selected unless and until you cancel. You acknowledge you can cancel any time via the Auto-Replenish page in My Account.',

            // Regular text for other UI elements
            byClicking: 'By clicking the Place Order button below, you also agree to Sephora’s',
            termsOfService: 'Terms of Use',
            conditionsOfUse: 'and acknowlege that you have read the',
            privacyPolicy: 'Privacy Policy'
        };
    } else {
        resources = {
            // Link text for the terms and conditions
            sduTermsLink: 'Sephora Same-Day Unlimited Subscription Terms & Conditions',

            // Trial + Auto-Replenish text
            sduAgreementIntro: 'I Agree to the ',
            sduTrialDetailsText: `After my 30-day promotional trial, I authorize Sephora to charge ${vars[0]} to my default payment method or another payment method on file, and I understand that my subscription will automatically renew and I will be charged this amount annually unless and until I cancel. I acknowledge I can cancel any time via the Same-Day Unlimited page in My Account.`,

            // Subscription + Auto-Replenish text
            sduSubscriptionDetailsText: 'By placing this order, I authorize Sephora to charge {0} to my default payment method or another payment method on file, and I understand that my subscription will automatically renew and I will be charged this amount annually unless and until I cancel. I acknowledge I can cancel any time via the Same-Day Unlimited page in My Account.',

            // Regular text for other UI elements
            byClicking: 'By clicking the Place Order button, I also agree to Sephora’s',
            termsOfService: 'Terms of Use',
            conditionsOfUse: 'and I acknowlege that I have read the',
            privacyPolicy: 'Privacy Policy'
        };
    }

    return resources[label];
}
