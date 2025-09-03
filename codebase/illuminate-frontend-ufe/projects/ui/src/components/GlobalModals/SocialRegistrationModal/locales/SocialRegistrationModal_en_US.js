export default function getResource(label, vars = []) {
    const resources = {
        lead: 'To use this feature, you need to be a Beauty Insider Community member.',
        cta: 'Join and Continue',
        desc: 'Community members can ask questions, join challenges, and get recommendations from other members.',
        biAlt: 'Beauty Insider Community',
        nickName: 'Please enter your preferred nickname.',
        nickNameLabel: 'Create Nickname',
        nickNameLength: 'Nicknames must be 4 to 15 characters (letters or numbers) long. Special characters are not allowed.',
        fixNickName: 'Please remove special characters from your nickname.',
        agreeTermsAndConditions: 'You must agree to the Community Terms and Conditions to continue',
        agreeBiTermsAndConditions: 'Join Beauty Insider and agree to Beauty Insider Terms and Conditions.',
        termsOfUse: 'TERMS OF USE',
        joinNow: 'Join and Continue',
        joinCommunity: 'Join Community & agree to',
        joinBiTerms: 'Certain Community profile information is public. You will also join Sephora’s Beauty Insider program and agree to the',
        biTermsAndConditions: 'Beauty Insider Terms & Conditions',
        receiveEmails: ' and to automatically receive emails.',
        publicProfile: 'Certain Community profile information is public.',
        birthdayLegend: 'Enter your birthdate to receive a free gift every year.'
    };
    return resources[label];
}
