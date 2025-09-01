export default function getResource(label, vars = []) {
    const resources = {
        add: 'Ajouter',
        happyBday: 'Joyeux anniversaire',
        chooseGift: 'Choisissez votre cadeau d’anniversaire',
        daysToRedeem: `<b>${vars[0]}</b> encore  jours pour échanger`,
        viewAll: 'Voir tout'
    };

    return resources[label];
}
