export default function getResource(label, vars = []) {
    const resources = {
        giftCardLabel: 'Carte-cadeau',
        hasBeenApplied: 'a été appliqué',
        applied: 'appliqué',
        removeLink: 'Retirer',
        removeGiftCardText: 'Supprimer la carte-cadeau',
        areYouSureMessage: 'Voulez-vous vraiment supprimer cette carte-cadeau de votre commande?'
    };
    return resources[label];
}
