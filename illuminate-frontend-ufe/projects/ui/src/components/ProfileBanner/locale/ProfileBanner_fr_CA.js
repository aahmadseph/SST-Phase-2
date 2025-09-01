export default function getResource(label, vars = []) {
    const resources = {
        beautyInsiderTitle: 'Beauty Insider',
        beautyInsiderDescription: 'Votre activité de fidélisation, vos économies, vos avantages et plus encore.',
        rewardsBazaarTitle: 'Rewards Bazaar®',
        rewardsBazaarDescription: 'Échangez vos points pour des échantillons et plus encore.',
        joinNowBtn: 'S’inscrire',
        signInBtn: 'Ouvrir une session',
        rewardText: 'Prêt à obtenir votre récompense?',
        beautyText: 'Déjà membre Beauty Insider?',
        insiderText: 'Vous êtes',
        vibText: 'Vous êtes',
        pointsText: 'Vos points',
        with: 'avec ',
        points: ' points.',
        barcodeTitle: 'Votre carte Beauty Insider',
        barcodeDesc: 'Balayez ce code à barres à la caisse du magasin pour accumuler des points et profiter des récompenses.',
        showCard: 'Montrez votre carte Beauty Insider'
    };
    return resources[label];
}
