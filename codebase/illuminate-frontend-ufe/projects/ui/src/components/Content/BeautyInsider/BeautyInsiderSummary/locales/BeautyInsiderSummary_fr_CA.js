export default function getResource(label, vars = []) {
    const resources = {
        title: 'Votre résumé',
        birthdayGiftTitle: 'Choisissez votre cadeau d’anniversaire',
        bankRewards: `Récompenses de la carte de crédit : *${vars[0]} $*`,
        pointsMultiplierText: `Événement multiplicateur de points : Accumulez *${vars[0]}* points sur vos achats`,
        rougeRewardsApply: `Récompenses Rouge : Appliquer à votre achat pour profiter d’une réduction allant jusqu’à *${vars[0]}*`,
        dollarsSaved: `Vos économies ${vars[0]} en un coup d’œil`,
        SDDRougeTestFreeShipping: `En tant que membre Rouge, vous pouvez essayer *gratuitement la livraison le jour même* sur toute commande de ${vars[0]} $ ou plus`,
        rougeMemberFreeSameDayDelivery: 'En tant que membre Rouge, vous pouvez essayer *gratuitement de la livraison le jour même*!',
        freeShip: 'Vous profitez de *l’expédition standard GRATUITE* sur toutes les commandes',
        rougeBadge: 'EXCLUSIVITÉ ROUGE',
        customerLimitTitle: 'Rabais d’employé :',
        customerLimitText: `${vars[0]} $ de la limite de ${vars[1]} $ jusqu’au ${vars[2]}.`,
        dtsDownErrorMessage: 'Les renseignements sont temporairement indisponibles.'
    };

    return resources[label];
}
