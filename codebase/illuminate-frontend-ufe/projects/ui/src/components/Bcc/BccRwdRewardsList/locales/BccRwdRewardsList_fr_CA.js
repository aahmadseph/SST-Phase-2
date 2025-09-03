export default function getResource(label, vars = []) {
    return {
        beautyInsiderRewards: 'Récompenses Beauty Insider',
        add: 'Ajouter',
        viewAll: 'Voir tout',
        signInToAccess: 'Ouvrir une session pour accéder au compte',
        notSignedIn: 'Ouvrir une session pour échanger vos points.',
        notEnoughPoints: 'Vous avez',
        keepEarning: 'Continuez d’accumuler pour obtenir des récompenses!',
        redeemPoints: 'Échanger vos',
        points: 'points',
        rougeBadge: 'ROUGE'
    }[label];
}
