export default function getResource(label, vars = []) {
    const resources = {
        congrats: `Félicitations, ${vars[0]}!`,
        hi: `Bonjour, ${vars[0]}`,
        points: 'points',
        summary: 'Votre résumé Beauty Insider',
        birthdayGiftTitle: 'Choisissez votre cadeau d’anniversaire',
        bankRewards: `Récompenses de la carte de crédit : ${vars[0]} $`,
        showCard: 'Montrez votre carte Beauty Insider',
        barcodeTitle: 'Votre carte Beauty Insider',
        barcodeDesc: 'Balayez ce code à barres à la caisse du magasin pour accumuler des points et profiter des récompenses.',
        dollarsSaved: `Vos économies ${vars[0]} en un coup d’œil`,
        pointsMultiplierText: `Événement multiplicateur de points : Accumulez *${vars[0]}* points sur vos achats`,
        referEarn: 'Recommandez et accumulez : ',
        pointsUppercase: 'Points',
        rougeRewardsApply: `Récompenses Rouge : Appliquer à votre achat pour profiter d’une réduction allant jusqu’à *${vars[0]}*`,
        rougeMemberFreeSameDayDelivery: 'En tant que membre Rouge, vous pouvez essayer *gratuitement de la livraison le jour même*!',
        freeShip: 'Vous profitez de *l’expédition standard GRATUITE* sur toutes les commandes',
        SDDRougeTestFreeShipping: `En tant que membre Rouge, vous pouvez essayer *gratuitement la livraison le jour même* sur toute commande de ${vars[0]} $ ou plus`
    };

    return resources[label];
}
