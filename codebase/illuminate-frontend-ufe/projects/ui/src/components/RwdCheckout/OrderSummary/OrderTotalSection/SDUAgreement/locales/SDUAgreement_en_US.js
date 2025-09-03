export default function getResource(label, vars) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            agree: 'You Agree to the',
            sephoraSDU: 'Sephora Same-Day Unlimited Subscription',
            termsAndConditions: 'Terms & Conditions',
            afterTrial:
                `After your 30-day trial, you authorize Sephora to charge ${vars[0]} annually to your default payment method or another payment method on file. Your subscription will automatically renew and continues until canceled. You acknowledge you can cancel anytime via the Same-Day Unlimited page in My Account.`,
            authorize:
                `You authorize Sephora to charge ${vars[0]} annually to your default payment method or another payment method on file. Your subscription will automatically renew and continues until canceled. You acknowledge you can cancel anytime via the Same-Day Unlimited page in My Account.`,
            byClicking: 'By clicking the Place Order button, you also agree to Sephora’s',
            termsOfService: 'Terms of Service',
            conditionsOfUse: 'and Conditions of Use, and have read the',
            privacyPolicy: 'Privacy Policy'
        };
    } else {
        resources = {
            agree: 'I Agree to the',
            sephoraSDU: 'Sephora Same-Day Unlimited Subscription',
            termsAndConditions: 'Terms & Conditions',
            afterTrial:
                    `After my 30-day trial, I authorize Sephora to charge ${vars[0]} annually to my default payment method or another payment method on file. My subscription will automatically renew and continues until canceled. I acknowledge I can cancel anytime via the Same-Day Unlimited page in My Account.`,
            authorize:
                    `I authorize Sephora to charge ${vars[0]} annually to my default payment method or another payment method on file. My subscription will automatically renew and continues until canceled. I acknowledge I can cancel anytime via the Same-Day Unlimited page in My Account.`,
            byClicking: 'By clicking the Place Order button, I also agree to Sephora’s',
            termsOfService: 'Terms of Service',
            conditionsOfUse: 'and Conditions of Use, and have read the',
            privacyPolicy: 'Privacy Policy'
        };
    }

    return resources[label];
}
