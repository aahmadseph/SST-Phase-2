export default function getResource(label, vars = []) {
    const resources = {
        mobileModalTitle: 'Subscribe to Sephora',
        mobileModalSubtitle: 'You’re so close! A text is on the way.',
        sent: 'We sent it to you at',
        buttonContinue: 'Continue Shopping',
        mobileTerms: `By entering your phone number, clicking Complete Sign Up, you consent to the [TEXT TERMS|${vars[0]}] and to receive autodialed marketing texts, 
        including abandoned cart reminders. Message frequency varies. Consent is not a condition of purchase. Message and data rates may apply. 
        See our [PRIVACY POLICY|${vars[1]}] and [NOTICE OF FINANCIAL INCENTIVE|${vars[2]}]. Text STOP to cancel at any time. Text HELP for help.`,
        mobileTermsAdditionalInfo: ' Sephora: 600 de Maisonneuve Boulevard West, Suite 2400, Montréal, Quebec, H3A 3J2, Canada. 1-877-737-4672.'
    };

    return resources[label];
}
