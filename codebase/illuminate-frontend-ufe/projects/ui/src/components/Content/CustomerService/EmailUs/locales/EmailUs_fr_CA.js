const resources = {
    emailUs: 'Envoyez-nous un courriel',
    firstName: 'Prénom',
    lastName: 'Nom de famille',
    emailAddress: 'Adresse de courriel',
    subject: 'Objet',
    biIdOptional: 'Compte Beauty Insider (facultatif)',
    orderNumberOptional: 'Numéro de commande (facultatif)',
    enterComment: 'Saisir un commentaire (1000 caractères maximum)',
    commentRequired: 'Vous devez écrire un commentaire.',
    personalInfoConfidential: 'Tous les renseignements personnels sont strictement confidentiels.',
    sendEmail: 'Envoyer un courriel',
    thankYou: 'Merci d’avoir communiqué avec Sephora',
    inTouchSoon: 'Un représentant vous contactera bientôt.',
    ok: 'OK'
};

export default function getResource(label) {
    return resources[label];
}
