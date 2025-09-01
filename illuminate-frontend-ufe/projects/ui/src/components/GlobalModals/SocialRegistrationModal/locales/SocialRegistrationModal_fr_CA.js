export default function getResource(label, vars = []) {
    const resources = {
        lead: 'Vous devez être membre de la collectivité Beauty Insider pour utiliser cette fonction.',
        cta: 'S’inscrire et continuer',
        desc: 'Les membres de la collectivité peuvent poser des questions, relever des défis et obtenir des recommandations de la part des autres membres.',
        biAlt: 'Collectivité Beauty Insider',
        nickName: 'Veuillez saisir votre pseudonyme.',
        nickNameLabel: 'Créer un pseudonyme',
        nickNameLength: 'Les pseudonymes doivent comporter de 4 à 15 caractères (lettres ou chiffres). Les caractères spéciaux ne sont pas autorisés.',
        fixNickName: 'Veuillez éliminer les caractères spéciaux de votre pseudonyme.',
        agreeTermsAndConditions: 'Vous devez accepter les conditions d’utilisation de la collectivité pour continuer',
        agreeBiTermsAndConditions: 'Devenez membre Beauty Insider et acceptez les conditions d’utilisation de Beauty Insider.',
        termsOfUse: 'CONDITIONS D’UTILISATION',
        joinNow: 'S’inscrire et continuer',
        joinCommunity: 'Rejoignez la collectivité et acceptez',
        joinBiTerms: 'Certaines informations du profil de la collectivité sont publiques. Vous adhérerez également au programme Beauty Insider de Sephora et accepterez',
        biTermsAndConditions: 'Modalités Beauty Insider',
        receiveEmails: ' et de recevoir automatiquement les courriels.',
        publicProfile: 'Certaines informations du profil de la collectivité sont publiques.',
        birthdayLegend: 'Saisissez votre date d’anniversaire et recevez un cadeau gratuit tous les ans.'
    };
    return resources[label];
}
