export default function getResource(label, vars = []) {
    const resources = {
        referEarn: 'Recommandez et accumulez',
        ends: `Prend fin ${vars[0]}`,
        copy: 'Copier',
        copied: 'Copié',
        seeMore: 'Voir plus',
        referralCheckIn: 'Suivi de recommandation',
        earnedPoints: 'Bravo! En recommandant le programme à vos amis, vous avez accumulé ',
        points: 'points.'
    };

    return resources[label];
}
