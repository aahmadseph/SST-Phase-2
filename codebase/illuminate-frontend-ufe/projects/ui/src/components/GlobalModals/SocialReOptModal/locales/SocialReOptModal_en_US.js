export default function getResource(label, vars = []) {
    const resources = {
        updateTermsOfUse: 'Updated Sephora Terms of Use',
        askQuestionsBi: 'Real people. Real talk. Real time. Find beauty inspiration, ask questions, and get the right recommendations from Beauty Insider members like you. You ready?',
        termsChanged: 'Our Terms of Use have changed.',
        agreeToContinue: 'By choosing “Continue” you agree to our',
        termsOfUse: 'Terms of Use',
        agreeToPublicPage: 'Certain Community profile information is public. If you choose “Cancel“, you will still have a public profile page. See',
        forMoreInformation: 'for more information.',
        joinAndAgree: 'Join Community & agree to',
        agreeTermsAndConditions: 'You must agree to the Community Terms and Conditions to continue',
        continue: 'continue'
    };
    return resources[label];
}
