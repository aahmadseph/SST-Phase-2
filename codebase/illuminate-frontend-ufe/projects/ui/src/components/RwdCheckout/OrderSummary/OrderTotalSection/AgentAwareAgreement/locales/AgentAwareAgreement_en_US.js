export default function getResource(label, vars) {
    const resources = {
        confirm: 'I confirm that I have read the subscription for',
        sephoraSDU: 'Same Day-Unlimited',
        and: 'and',
        autoReplenish: 'Auto-Replenish',
        toClient: 'to the client and received their verbal consent.',
        sduModalTitle: 'Same Day Unlimited.',
        sduModalBody: 'Please use the script below for reference.\n\n' +
            'You are signing up for a Sephora Same Day Unlimited and will be charged forty-nine dollars plus tax for a one-year subscription that will automatically renew every 12 months unless and until you cancel.\n\n' +
            'Once subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\n' +
            'Do I have your consent to enroll you in Sephora Same Day Unlimited? Please reply with “Yes” to enroll, or you can say “No” if you do not wish to proceed.\n\n' +
            '(Once the client responds with yes, check the designated checkbox that affirms you read the client the disclosures and sign up the client for Same Day Unlimited)\n\n' +
            'You are now subscribed to Sephora Same Day Unlimited. You will receive an email shortly with all the details on this subscription. Enjoy this service and thank you for Shopping with Sephora!',
        autoReplenishModalTitle: 'Auto-Replenish subscription.',
        autoReplenishModalBody: 'Please use the script below for reference.\n\n' +
            'You are signing up for a Sephora Auto-Replenish subscription.' +
            'Every *{INSERT FREQUENCY}* you will be charged *{INSERT PRICE}* dollars plus tax for *{INSERT QUANTITY}* unit(s) of *{INSERT ITEM}* on an automatically renewing basis unless and until you cancel.\n\n' +
            'Once subscribed, you will receive an email with links to the complete subscription Terms and Conditions, and instructions for how to cancel this subscription.\n\n' +
            'Do I have your consent to enroll you in the Sephora Auto-Replenishment program for *{INSERT PRODUCT NAME}*? Please reply with “Yes” to enroll, or you can say “No” if you do not wish to proceed.\n\n' +
            '(Once the client responds with yes, Agent checks the designated checkbox that affirms you read the client the disclosures and submit the client for Auto-Replenish)\n\n' +
            'Thank you for your patience. You are now subscribed to Sephora Auto-Replenishment for *{INSERT PRODUCT NAME}*. You will receive an email shortly explaining these details.'
    };

    return resources[label];
}
