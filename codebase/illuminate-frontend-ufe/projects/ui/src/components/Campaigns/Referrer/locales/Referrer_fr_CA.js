export default function getResource(label, vars = []) {
    const resources = {
        shopNow: 'Magasiner',
        signIn: 'Ouvrir une session',
        createAccount: 'Créer un compte',
        joinNow: 'S’inscrire',
        errorCampaignHasntStarted: 'Désolé, la promotion saisie n’a pas encore commencé.',
        errorCampaignExpired: 'Désolé, la promotion saisie a expiré.',
        errorMaxCount1: 'Désolé, ce lien a atteint sa limite d’échange maximale.',
        errorMaxCount2: 'Veuillez communiquer avec la personne qui vous a envoyé le lien.',
        errorInvalidCampaign: 'Cette promotion n’existe pas.',
        errorInvalidCountry: 'Cette promotion n’est pas offerte dans ce pays.',
        errorRefereeAlreadyRegisteredLine1: 'Vous vous êtes déjà inscrit(e) pour recevoir votre réduction de 20 %!',
        errorRefereeAlreadyRegisteredLine2: 'Consultez votre boîte de réception pour plus de détails.',
        errorRefereeMaxCountReachedLine1: 'Désolé, ce lien a déjà été utilisé par un(e) autre ami(e).',
        errorRefereeMaxCountReachedLine2: 'Veuillez communiquer avec la personne qui vous a envoyé le lien.',
        selfRegistrationNotAllowedLine1: 'Oups, vous ne pouvez pas utiliser votre propre lien.',
        selfRegistrationNotAllowedLine2: 'Veuillez copier et coller ce lien et partagez-le avec un(e) ami(e).',
        errorAlreadyBI: 'Cette promotion n’est pas offerte aux membres Beauty Insider actuels.',
        errorAdvocacyDown: 'Oups! Le service n’est pas disponible pour le moment.',
        errorBiDown: 'Beauty Insider n’est pas disponible pour le moment.',
        errorGenericDescription: 'Nous tentons de le remettre en ligne. Veuillez réessayer plus tard. D’ici là, profitez-en pour vous inspirer en explorant notre site.',
        valid: 'Valide',
        yourPurchase: 'votre achat'
    };

    return resources[label];
}
