export default function getResource(label, vars = []) {
    const resources = {
        title: 'Ajouter des récompenses',
        cancel: 'Annuler',
        remove: 'Retirer',
        done: 'Terminé',
        biPointsText: 'Vous êtes',
        biPointsInsiderText: 'Vous êtes',
        with: 'avec',
        points: 'points.',
        addFullSize: 'Ajouter le produit en format standard',
        addToBasket: 'Ajouter au panier',
        addToBasketShort: 'Ajouter',
        signInToAccess: 'Accéder au compte',
        allRewards: 'Toutes les récompenses',
        chooseBirthdayGift: 'Choisissez votre cadeau d’anniversaire',
        birthdayMessage: `Joyeux anniversaire, ${vars[0]}!`,
        daysToRedeem: `<b>${vars[0]}</b> encore  jours pour échanger`,
        birthdayGiftText: 'Cadeau d’anniversaire',
        lastChanceRedeemToday: 'Dernière chance : utilisez-la aujourd’hui!',
        rougeBadge: 'ROUGE'
    };

    return resources[label];
}
