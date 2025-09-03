export default function getResource(label, vars = []) {
    const resources = {
        recentActivityText: 'Activité récente',
        viewAllActivityLink: 'Voir toute l’activité',
        spendLabel: 'Dépensez',
        earnedLabel: 'Gagnés',
        spendText: 'Dépensez'
    };

    return resources[label];
}
