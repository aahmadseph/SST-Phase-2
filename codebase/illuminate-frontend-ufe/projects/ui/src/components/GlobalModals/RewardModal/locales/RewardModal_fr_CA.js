export default function getResource(label, vars = []) {
    const resources = {
        beautyInsiderRewards: 'Récompenses Beauty Insider',
        done: 'Terminé',
        status: 'Statut',
        points: 'points',
        youNowHave: 'Vous avez actuellement',
        youAreExceeding: 'Vous dépassez de'
    };

    return resources[label];
}
