export default function getResource(label, vars) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            agree: 'You Agree',
            toThe: 'to the',
            sephoraSDU: 'Sephora Same-Day Unlimited Subscription Terms & Conditions.',
            termsAndConditions: 'Terms & Conditions',
            afterTrial:
                `After your 30-day promotional trial, you authorize Sephora to charge ${vars[0]} to your default payment method or another payment method on file, and you understand that your subscription will automatically renew and you will be charged this amount annually unless and until you cancel. You acknowledge you can cancel any time via the Same-Day Unlimited page in My Account.`,
            authorize:
                `By placing this order, you authorize Sephora to charge ${vars[0]} to your default payment method or another payment method on file, and you understand that your subscription will automatically renew and you will be charged this amount annually unless and until you cancel. You acknowledge you can cancel any time via the Same-Day Unlimited page in My Account.`,
            byClicking: 'By clicking the Place Order button below, you also agree to Sephora\'s',
            termsOfService: 'Terms of Use',
            conditionsOfUse: 'and acknowledge that you have read the',
            privacyPolicy: 'Privacy Policy',
            title: 'Terms & Conditions',
            almostThere: 'Almost there! Please review and accept the following terms:',
            placeOrder: 'Place Order',
            agentConfirmPrefix: 'I confirm that I have read the scripts in the subscription link',
            sameDayHyphenated: 'Same-Day Unlimited',
            agentConfirmSuffix: 'to the client and received their verbal consent.',

            sduTrialTitle: 'Same-Day Unlimited (Trial)',
            sduTrialScriptHeader: 'Please use the script below for reference',
            sduTrialScript: `You are signing up for a 30 day free trial for Sephora Same-Day Unlimited. Unless you cancel before the end of the trial period, you will automatically be charged ${vars[0]} dollars plus tax for a year-long subscription to Sephora Same-Day Unlimited. This subscription automatically renews every 12 months unless and until you cancel.\n\nOnce subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\nDo I have your consent to enroll you in the Sephora Same-Day Unlimited Delivery program, beginning with the free 30-day trial? Please reply with "Yes" to enroll, or you can say "No" if you do not wish to proceed.\n\n(Once the client responds with yes, check the designated checkbox that affirms you read the client the disclosures and sign up the client for Same-Day Unlimited)\n\nThank you! You are now subscribed to Sephora Same-Day Unlimited starting with a free trial that goes for 30 days. You will receive an email shortly with all the details on this subscription. Enjoy this service and thank you for Shopping with Sephora!`,

            afterSduTrialTitle: 'Same-Day Unlimited Subscription',
            afterSduTrialScriptHeader: 'Please use the script below for reference',
            afterSduTrialScript: `You are signing up for a Sephora Same-Day Unlimited and will be charged ${vars[0]} dollars plus tax for a one-year subscription that will automatically renew every 12 months unless and until you cancel.\n\nOnce subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\nDo I have your consent to enroll you in Sephora Same-Day Unlimited? Please reply with "Yes" to enroll, or you can say "No" if you do not wish to proceed.\n\n(Once the client responds with yes, check the designated checkbox that affirms you read the client the disclosures and sign up the client for Same-Day Unlimited)\n\nYou are now subscribed to Sephora Same-Day Unlimited. You will receive an email shortly with all the details on this subscription. Enjoy this service and thank you for Shopping with Sephora!`,
            cancelText: 'Cancel'
        };
    } else {
        resources = {
            agree: 'I Agree',
            toThe: 'to the',
            sephoraSDU: 'Sephora Same-Day Unlimited Subscription Terms & Conditions.',
            termsAndConditions: 'Terms & Conditions',
            afterTrial:
                    `After my 30-day promotional trial, I authorize Sephora to charge ${vars[0]} to my default payment method or another payment method on file, and I understand that my subscription will automatically renew and I will be charged this amount annually unless and until I cancel. I acknowledge I can cancel any time via the Same-Day Unlimited page in My Account.`,
            authorize:
                    `By placing this order, I authorize Sephora to charge ${vars[0]} to my default payment method or another payment method on file, and I understand that my subscription will automatically renew and I will be charged this amount annually unless and until I cancel. I acknowledge I can cancel any time via the Same-Day Unlimited page in My Account.`,
            byClicking: 'By clicking the Place Order button, I also agree to Sephora\'s',
            termsOfService: 'Terms of Use,',
            conditionsOfUse: 'and I acknowledge that I have read the',
            privacyPolicy: 'Privacy Policy',
            title: 'Terms & Conditions',
            almostThere: 'Almost there! Please review and accept the following terms:',
            placeOrder: 'Place Order',
            agentConfirmPrefix: 'I confirm that I have read the scripts in the subscription link',
            sameDayHyphenated: 'Same Day-Unlimited',
            agentConfirmSuffix: 'to the client and received their verbal consent.',

            sduTrialTitle: 'Same-Day Unlimited (Trial)',
            sduTrialScriptHeader: 'Please use the script below for reference',
            sduTrialScript: `You are signing up for a 30 day free trial for Sephora Same Day Unlimited. Unless you cancel before the end of the trial period, you will automatically be charged ${vars[0]} dollars plus tax for a year-long subscription to Sephora Same Day Unlimited. This subscription automatically renews every 12 months unless and until you cancel.\n\nOnce subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\nDo I have your consent to enroll you in the Sephora Same Day Unlimited Delivery program, beginning with the free 30-day trial? Please reply with "Yes" to enroll, or you can say "No" if you do not wish to proceed.\n\n(Once the client responds with yes, check the designated checkbox that affirms you read the client the disclosures and sign up the client for Same Day Unlimited)\n\nThank you! You are now subscribed to Sephora Same Day Unlimited starting with a free trial that goes for 30 days. You will receive an email shortly with all the details on this subscription. Enjoy this service and thank you for Shopping with Sephora!`,

            afterSduTrialTitle: 'Same-Day Unlimited Subscription',
            afterSduTrialScriptHeader: 'Please use the script below for reference',
            afterSduTrialScript: `You are signing up for a Sephora Same Day Unlimited and will be charged ${vars[0]} dollars plus tax for a one-year subscription that will automatically renew every 12 months unless and until you cancel.\n\nOnce subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\nDo I have your consent to enroll you in Sephora Same Day Unlimited?`,
            cancelText: 'Cancel'
        };
    }

    return resources[label];
}
