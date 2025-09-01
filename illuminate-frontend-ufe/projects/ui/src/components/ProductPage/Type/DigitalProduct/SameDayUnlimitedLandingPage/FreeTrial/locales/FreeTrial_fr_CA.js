export default function getResource(label) {
    const resources = {
        free30DayTrial: 'essai GRATUIT de 30 jours',
        then: 'ensuite',
        annually: '49 $ annuellement',
        joinForOnly: 'Inscrivez-vous pour seulement'
    };

    return resources[label];
}
