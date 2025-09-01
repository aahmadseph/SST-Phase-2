export default function getResource(label, vars = []) {
    const resources = {
        smsSignupModalTitle: 'Get SMS Order Updates',
        greeting: `Hi ${vars[0]},`,
        beautiful: 'Beautiful',
        smsSignupModalTextHeading: 'Get SMS updates for this order.',
        smsSignupModalTextInputHeading: 'Enter your mobile phone number below.',
        enterMobileNumber: 'Mobile Phone Number',
        smsSignUpModalTerms1: 'I agree to the ',
        textTerms: 'TEXT TERMS',
        smsSignUpModalTerms2: ' and authorize Sephora to use an automated system, an autodialer, an automated system for the selection and/or dialing of telephone numbers, an automatic telephone dialing system (“ATDS”), and/or any other type of system, software, hardware, or machine (no matter how it may be classified) that may use an automated procedure or process for sending text messages regarding my order to the mobile number provided. Consent is not a condition of purchase. Message & data rates may apply. See our ',
        privacyPolicy: 'PRIVACY POLICY',
        signupTextNotifText: 'Sign me up to receive text notifications about this order.',
        signUpNow: 'Sign Up Now',
        invalidNumberErrorMessage: 'Please enter a valid mobile phone number.',
        textTermsErrorMessage: 'You need to agree to the terms & conditions before you can continue.',
        genericErrorMessage: 'Oops! We had an issue processing your request. Please try again.',
        gotIt: 'Got It',
        smsSignupConfirmationHeadingUSA: 'You’re all set!',
        smsSignupConfirmationHeadingCA: 'You’re so close! A text is on the way.',
        smsSignupConfirmationTextUSA: `A confirmation text is on the way. We sent it to ･･･ ･･･ ･${vars[0]}.`,
        smsSignupConfirmationTextCA: `We sent it to ･･･ ･･･ ･${vars[0]}. Reply Y to confirm your subscription.`
    };

    return resources[label];
}
