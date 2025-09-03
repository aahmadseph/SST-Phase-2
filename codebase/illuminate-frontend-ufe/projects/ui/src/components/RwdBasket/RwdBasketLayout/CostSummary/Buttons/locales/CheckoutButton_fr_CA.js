export default function getResource (label, vars = []) {
    const resources = {
        checkout: 'Passer à la caisse',
        gotIt: 'Compris',
        rewardWarning: 'Avertissement code promotionnel/de récompense',
        checkoutIneligibleForSdd: 'Ce type de commande n’est pas admissible aux récompenses Rouge. Veuillez supprimer vos récompenses Rouge.'
    };

    return resources[label];
}
