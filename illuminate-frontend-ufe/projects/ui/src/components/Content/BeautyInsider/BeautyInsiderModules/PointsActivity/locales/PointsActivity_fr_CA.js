export default function getResource(label, vars = []) {
    const resources = {
        orderNumber: 'Numéro de commande',
        pointsRedeemed: 'Points échangés',
        pointsearned: 'Points gagnés',
        totalPoints: 'Total des points à ce jour',
        spentToDate: 'Dépenses à ce jour',
        viewAll: 'Voir tout',
        title: 'Activité liée aux points',
        noPoints: 'Votre activité liée aux points s’affichera ici.',
        doNotSeePoints: 'Vous ne voyez pas encore vos points? Votre activité sera mise à jour dans les 24 heures.'
    };
    return resources[label];
}
