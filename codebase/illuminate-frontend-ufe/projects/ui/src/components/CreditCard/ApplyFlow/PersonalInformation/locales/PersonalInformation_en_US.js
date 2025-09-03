const resources = {
    personalInformationTitle: '2. Personal Information',
    requiredInfoNote: 'Required Information',
    emailAddressLabel: 'Email Address',
    onePhoneRequired: 'One phone number is required',
    mobileNumberLabel: 'Mobile Number',
    altNumberLabel: 'Alternate Number',
    byProvidingContactText: 'By providing your contact information above, including any cellular or other phone numbers, you agree to be contacted regarding any of your Comenity Bank or Comenity Capital Bank accounts via calls to cell phones, text messages or telephone calls, including the use of artificial or pre-recording message calls, as well as calls made via automatic telephone dialing systems, or via email.',
    ifYouDontHavePhoneText: 'If you do not currently have a phone number associated with your Beauty Insider profile, Sephora will save the provided number to your account. You can change your number at any time by logging into your profile.'
};

export default function getResource(label) {
    return resources[label];
}
