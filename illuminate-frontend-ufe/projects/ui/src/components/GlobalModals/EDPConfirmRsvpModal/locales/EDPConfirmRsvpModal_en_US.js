export default function getResource(label, vars = []) {
    const resources = {
        rsvp: 'RSVP',
        rsvpForEvent: `RSVP for ${vars[0]}`,
        rightPhoneNumber: 'Do we have the right phone number?',
        phoneNumberLabel: 'Phone Number',
        consentMessage: 'Yes, please send me text message reminders about my reservation.',
        iAgreeToThe: 'I agree to the',
        textTerms: 'TEXT TERMS',
        termsAndConditions: 'and authorize Sephora to use an automated system, an autodialer, an automated system for the selection and/or dialing of telephone numbers, an automatic telephone dialing system (“ATDS”), and/or any other type of system, software, hardware, or machine (no matter how it may be classified) that may use an automated procedure or process for sending text messages regarding my appointment to the mobile number provided. Consent is not a condition of purchase. Message & data rates may apply. See our',
        privacyPolicy: 'Privacy Policy',
        cta: 'Complete RSVP',
        invalidPhoneNumberError: 'Enter a valid mobile phone number.'
    };

    return resources[label];
}
