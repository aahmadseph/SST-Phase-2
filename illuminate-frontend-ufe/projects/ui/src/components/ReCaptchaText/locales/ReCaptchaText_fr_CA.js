export default function getResource(label, vars = []) {
    const resources = {
        byClicking: 'En cliquant sur « S’inscrire », vous reconnaissez être résident du Canada ou des États-Unis ' +
            'et (1) avoir lu notre',
        privacyPolicy: 'politique de confidentialité',
        termsOfUse: 'conditions d’utilisation de Sephora',
        and: ' et ',
        agreeTo: ' acceptez ',
        noticeFinancialIncentive: 'Avis de prime financière',
        biTerms: 'modalités Beauty Insider',
        receiveOffers: 'et de recevoir automatiquement les offres Beauty Insider ainsi que ' +
            'des notifications par courriel.',
        sephoraReCaptchaText: 'Sephora utilise ReCaptcha et les utilisateurs sont assujettis aux normes de Google en matière de',
        sephoraReCaptchaTextRegister: 'Sephora utilise ReCaptcha, et en s’enregistrant, les utilisateurs sont assujettis aux normes de Google en matière de',
        googlePrivacyPolicyLink: 'politique de confidentialité',
        googleTermsLink: 'de paiement'
    };
    return resources[label];
}
