export default function getResource(label, vars = []) {
    const resources = {
        byClicking: 'By clicking “Join Now” you acknowledge that you are a U.S. or Canada ' +
            'resident and (1) have read Sephora’s',
        privacyPolicy: 'Privacy Policy',
        termsOfUse: 'Terms of Use',
        and: ' and ',
        agreeTo: ' agree to ',
        noticeFinancialIncentive: 'Notice of Financial Incentive',
        biTerms: 'Beauty Insider Terms',
        receiveOffers: ', and to automatically receive Beauty Insider offers and ' +
            'notifications via email.',
        sephoraReCaptchaText: 'Sephora uses Google ReCaptcha and users are subject to Google’s',
        sephoraReCaptchaTextRegister: 'Sephora uses Google ReCaptcha and by registering, users are subject to Google’s',
        googlePrivacyPolicyLink: 'privacy policy',
        googleTermsLink: 'terms'
    };
    return resources[label];
}
