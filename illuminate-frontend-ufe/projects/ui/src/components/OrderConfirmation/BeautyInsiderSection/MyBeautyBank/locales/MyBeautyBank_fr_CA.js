export default function getResource(label, vars = []) {
    const resources = {
        biSummaryText: 'Activité liée à vos points Beauty Insider',
        pointsEarned: 'Points gagnés',
        pointsUsed: 'Points utilisés',
        balanceUpdateMessage: 'Votre solde de points sera mis à jour dans les 24 heures.'
    };

    return resources[label];
}
