export default function getResource(label, vars = []) {
    const resources = {
        '50 Points': '50 Points',
        '100 Points': '100 points',
        '250-499 Points': '250 à 499 points',
        '500-749 Points': '500 à 749 points',
        '750-2999 Points': '750 à 2 999 points',
        '3000-4999 Points': '3 000 à 4 999 points',
        '5000-19999 Points': '5 000 à 1 999 points',
        '20000+ Points': 'Plus de 20 000 points',
        chooseYour: `Choisissez votre ${vars[0]}`,
        rougeBadge: 'ROUGE',
        daysToRedeem: `<b>${vars[0]}</b> encore  jours pour échanger`
    };

    return resources[label];
}
