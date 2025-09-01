export default function getResource(label, vars = []) {
    const resources = {
        title: 'Appliquer des récompenses Rouge',
        apply: 'Appliquer',
        applied: 'Appliqué',
        remove: 'Retirer',
        bopisRougeMessage: 'Seulement admissible dans votre ',
        bopisRougeMessageRedirect: 'Panier d’expédition et de livraison',
        rougeRewardsMessage: `<b>${vars[0]} de réduction</b> • Exp. ${vars[1]}`,
        newRougeRewardsMessage: `<b>${vars[0]} de réduction </b> disponible • Exp. ${vars[1]}`,
        rougeRewardsAppliedMessage: `<b>${vars[0]} de réduction </b>appliqué`,
        switchToUS: 'La récompense Rouge ne peut être utilisée que dans le pays où la récompense a été échangée. Veuillez passer à notre expérience de magasinage aux États-Unis pour utiliser cette récompense.',
        switchToCA: 'La récompense Rouge ne peut être utilisée que dans le pays où la récompense a été échangée. Veuillez passer à notre expérience de magasinage au Canada pour utiliser cette récompense.',
        sameDayDeliveryRougeMessage: 'Les récompenses Rouge ne sont pas offertes pour ce type de commande.',
        checkoutTitle: 'Appliquer une récompense Rouge'
    };

    return resources[label];
}
