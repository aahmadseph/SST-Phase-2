const resources = {
    representative: 'Des représentants en temps réel sont disponibles :',
    monFriTime: 'de 5 h à 21 h HP',
    satSunTime: 'de 6 h à 21 h HP',
    monFri: 'Du lundi au vendredi',
    satSun: 'Samedi et dimanche',
    chatWithUs: 'Clavardez avec nous'
};

export default function getResource(label) {
    return resources[label];
}
