export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Subscribe to Sephora',
        continueShopping: 'Continue Shopping',
        heading: 'You’re so close! A text is on the way.',
        checkYourSMS: `We sent it to ${vars[0]}. \nReply Y to confirm your subscription.`,
        disclaimerLine1US: `By entering your phone number, clicking submit, and confirming sign-up, you consent to the ${vars[0]} and to receive recurring autodialed marketing texts, including abandoned cart reminders. Message frequency varies. Consent is not a condition of purchase. Message & data rates may apply. See our ${vars[1]} and ${vars[2]}. Text STOP to cancel at any time. HELP for help.`,
        disclaimerLine1CA: `By entering your phone number, clicking submit, and confirming sign-up, you consent to the ${vars[0]} and to receive recurring autodialed marketing texts with exclusive offers and product updates. Message frequency varies. Message & data rates may apply. See our ${vars[1]}. Text STOP to cancel at any time. HELP for help. Sephora: 600 de Maisonneuve Boulevard West, Suite 2400, Montréal, Quebec, H3A 3J2, Canada. 1-877-737-4672.`,
        textTerms: 'text terms',
        privacyPolicy: 'Privacy Policy',
        noticeOfFinancialInsentive: 'Notice of Financial Incentive'
    };

    return resources[label];
}
