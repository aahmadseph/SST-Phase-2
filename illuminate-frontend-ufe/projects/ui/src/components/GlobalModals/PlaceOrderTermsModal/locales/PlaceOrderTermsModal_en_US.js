export default function getResource (label, vars = []) {
    let resources = {};

    if (Sephora.isAgent) {
        resources = {
            title: 'Terms & Conditions',
            placeOrder: 'Place Order',
            cancel: 'Cancel',
            text: 'Almost there! Please review and accept the following terms:',
            arOnlyTitle: 'Terms & Conditions',
            arOnlyText: 'Almost there! Please review and accept the following terms:',
            arSubscriptionTitle: 'Auto-Replenish subscription',
            arSubscriptionHeader: 'Please use the script below for reference',
            arSubscriptionScript: `You are signing up for a Sephora Auto-Replenish subscription.\n\nEvery <b>${vars[0]}</b> you will be charged <b>${vars[1]}</b> dollars plus tax for <b>${vars[2]}</b> unit(s) of <b>${vars[3]}</b> on an automatically renewing basis unless and until you cancel.\n\nOnce subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\nDo I have your consent to enroll you in the Sephora Auto-Replenishment program for <b>${vars[4]}</b>? Please reply with “Yes” to enroll, or you can say “No” if you do not wish to proceed.\n\n(Once the client responds with yes, Agent checks the designated checkbox that affirms you read the client the disclosures and submit the client for Auto-Replenish)\n\nThank you for your patience. You are now subscribed to Sephora Auto-Replenishment for <b>${vars[5]}</b>. You will receive an email shortly explaining these details.`,

            arsduText: 'I confirm that I have read the scripts in the subscription link ',
            sduLink: 'Same Day-Unlimited',
            and: ' and ',
            arLink: 'Auto-Replenish Subscription',
            arsduText2: ' to the client and received their verbal consent.',

            // sdu
            sduTrialTitle: 'Same-Day Unlimited (Trial)',
            afterSduTrialTitle: 'Same-Day Unlimited Subscription',
            sduTrialScriptHeader: 'Please use the script below for reference',
            afterSduTrialScriptHeader: 'Please use the script below for reference',
            sduTrialScript: 'You are signing up for a 30 day free trial for Sephora Same-Day Unlimited. Unless you cancel before the end of the trial period, you will automatically be charged fifty-nine dollars plus tax for a year-long subscription to Sephora Same-Day Unlimited. This subscription automatically renews every 12 months unless and until you cancel.\n\nOnce subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\nDo I have your consent to enroll you in the Sephora Same-Day Unlimited Delivery program, beginning with the free 30-day trial? Please reply with "Yes" to enroll, or you can say "No" if you do not wish to proceed.\n\n(Once the client responds with yes, check the designated checkbox that affirms you read the client the disclosures and sign up the client for Same-Day Unlimited)\n\nThank you! You are now subscribed to Sephora Same-Day Unlimited starting with a free trial that goes for 30 days. You will receive an email shortly with all the details on this subscription. Enjoy this service and thank you for Shopping with Sephora!',
            afterSduTrialScript: 'You are signing up for a Sephora Same-Day Unlimited and will be charged fifty-nine dollars plus tax for a one-year subscription that will automatically renew every 12 months unless and until you cancel.\n\nOnce subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\nDo I have your consent to enroll you in Sephora Same-Day Unlimited? Please reply with "Yes" to enroll, or you can say "No" if you do not wish to proceed.\n\n(Once the client responds with yes, check the designated checkbox that affirms you read the client the disclosures and sign up the client for Same-Day Unlimited)\n\nYou are now subscribed to Sephora Same-Day Unlimited. You will receive an email shortly with all the details on this subscription. Enjoy this service and thank you for Shopping with Sephora!'
        };
    } else {
        resources = {
            title: 'Terms & Conditions',
            placeOrder: 'Place Order',
            cancel: 'Cancel',
            text: 'Almost there! Please review and accept the following terms:',
            arOnlyTitle: 'Auto-Replenish Subscription Terms',
            arOnlyText: 'Almost there! Please review and accept the following terms for your Auto-Replenish items:'
        };
    }

    return resources[label];
}
