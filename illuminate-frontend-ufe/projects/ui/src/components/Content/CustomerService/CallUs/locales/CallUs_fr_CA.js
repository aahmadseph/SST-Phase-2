const resources = {
    callUs: 'Appelez-nous',
    phone: '1-877-SEPHORA (1-877-737-4672)',
    phoneLocation: '(États-Unis ou Canada)',
    hearingImpaired: 'Sourds et malentendants/ATS',
    seeAccessibility: 'voir accessibilité',
    rougePrivate: 'Ligne d’assistance téléphonique privée des membres Rouge',
    rougePhone: '1-855-55-ROUGE',
    rougePhoneFull: '(1-855-557-6843)',
    representative: 'Des représentant(e)s sont disponibles :',
    monFri: 'Du lundi au vendredi',
    monFriTime: 'de 5 h à 21 h HP',
    satSun: 'Samedi et dimanche',
    satSunTime: 'de 6 h à 21 h HP'
};

export default function getResource(label) {
    return resources[label];
}
