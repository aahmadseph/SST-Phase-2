const resources = {
    personalInformationTitle: '2. Renseignements personnels',
    requiredInfoNote: 'Renseignements nécessaires',
    emailAddressLabel: 'Adresse de courriel',
    onePhoneRequired: 'Un seul numéro de téléphone est requis',
    mobileNumberLabel: 'Numéro de téléphone cellulaire',
    altNumberLabel: 'Autre numéro',
    byProvidingContactText: 'En fournissant vos coordonnées ci-dessus, y compris vos numéros de téléphone mobile ou fixe, vous acceptez d’être contacté pour des informations relatives à vos comptes Comenity Bank ou Comenity Capital Bank par appel téléphonique sur votre téléphone mobile, messages texte ou appels téléphoniques, y compris l’utilisation d’appels téléphoniques artificiels ou pré-enregistrés, ainsi que d’appels réalisés par des systèmes téléphoniques à composition automatique ou courriel.',
    ifYouDontHavePhoneText: 'Si vous n’avez pas de numéro de téléphone associé à votre profil Beauty Insider, Sephora enregistrera le numéro fourni dans votre compte. Vous pouvez modifier votre numéro en tout temps en ouvrant une session dans votre profil.'
};

export default function getResource(label) {
    return resources[label];
}
