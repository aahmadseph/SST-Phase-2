export default function getResource(label, vars = []) {
    const resources = {
        smsSignInModalTitle: 'Subscribe to Sephora Texts',
        greeting: `Hi ${vars[0]},`,
        ModalTextHeading: 'Get our texts!',
        ModalTextInputHeading: 'Stay in the loop on exclusive deals, product drops, and more when you sign up for Sephora Texts.',
        enterMobileNumber: 'Mobile Phone Number',
        signUpNow: 'Complete Sign Up',
        TermsAndConditon: 'By entering your phone number, clicking Complete Sign Up, and confirming sign-up, you consent to the ',
        TermsAndConditonCA: 'By entering your phone number, clicking Complete Sign Up, you consent to the ',
        textTerms: 'TEXT TERMS',
        TermsAndConditon2: ' and to receive autodialed marketing texts, including abandoned cart reminders. Message frequency varies. Consent is not a condition of purchase. Message and data rates may apply. See our ',
        privacyPolicy: 'PRIVACY POLICY',
        TermsAndConditon3: ' and ',
        notice: 'NOTICE OF FINANCIAL INCENTIVE.',
        TermsAndConditon4: ' Text STOP to cancel at any time. Text HELP for help.',
        TermsAndConditon5: ' Sephora: 160 Bloor St E Suite 1100, Toronto, ON M4W 0A2, Canada. 1-877-737-4672.'
    };

    return resources[label];
}
