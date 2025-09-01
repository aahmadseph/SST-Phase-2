export default function getResource(label, vars = []) {
    const resources = {
        rsvp: 'Réserver',
        rsvpForEvent: `Réserver pour ${vars[0]}`,
        rightPhoneNumber: 'Avons-nous le bon numéro de téléphone?',
        phoneNumberLabel: 'Numéro de téléphone',
        consentMessage: 'Oui, veuillez m’envoyer des rappels par message texte au sujet de ma réservation.',
        iAgreeToThe: 'J’accepte les',
        textTerms: 'MODALITÉS DES TEXTOS',
        termsAndConditions: 'et j’autorise Sephora à utiliser un système automatisé, un composeur automatique, un système automatisé pour la sélection ou la composition de numéros de téléphone, un système téléphonique de composition automatique ou tout autre type de système, de logiciel, de matériel ou de machine (peu importe la classification) qui peut utiliser une procédure ou un processus automatisé pour envoyer des messages textes concernant mon rendez-vous au numéro de téléphone cellulaire fourni. Le consentement n’est pas une condition d’achat. Des frais de messagerie texte et de données peuvent s’appliquer. Consultez notre',
        privacyPolicy: 'politique de confidentialité',
        cta: 'Remplir la réservation',
        invalidPhoneNumberError: 'Saisissez un numéro de téléphone cellulaire valide.'
    };

    return resources[label];
}
