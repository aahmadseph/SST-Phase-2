export default function getResource(label, vars = []) {
    const resources = {
        title: 'Appliquer des récompenses Rouge',
        apply: 'Appliquer',
        applied: 'Appliqué',
        remove: 'Retirer',
        rougeRewardsSubText: `${vars[0]} $ en récompenses Rouge`,
        rougeRewardsExpirationMessage: `Exp. ${vars[0]}`,
        done: 'Terminé',
        switchToUS: 'La récompense Rouge ne peut être utilisée que dans le pays où la récompense a été échangée. Veuillez passer à notre expérience de magasinage aux États-Unis pour utiliser cette récompense.',
        switchToCA: 'La récompense Rouge ne peut être utilisée que dans le pays où la récompense a été échangée. Veuillez passer à notre expérience de magasinage au Canada pour utiliser cette récompense.',
        checkoutTitle: 'Récompense Rouge',
        subtitle: 'Appliquer une récompense Rouge à votre achat'
    };

    return resources[label];
}
