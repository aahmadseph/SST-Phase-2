export default function getResource(label, vars = []) {
    const resources = {
        checkboxContentIsModalCheckbox: 'J’accepte les',
        beautyInsiderTC: 'Modalités Beauty Insider',
        rougeRewardValid: 'La récompense Rouge est valable pour <b>une transaction future uniquement</b>; elle <b>expire dans 90 jours</b> et sera envoyée par courriel dans les <b>24 heures</b>.',
        done: 'Terminé',
        youMustAcceptTermsConditions: 'Vous devez d’abord accepter les conditions.'
    };
    return resources[label];
}
