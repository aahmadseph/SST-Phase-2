export default function getResource(label, vars = []) {
    const resources = {
        howToUseCard: 'Comment utiliser une carte-cadeau',
        giftCard: 'Carte-cadeau',
        addGiftCard: 'Ajouter la carte-cadeau',
        giftCardNumber: 'Numéro de carte-cadeau',
        pin: 'NIP',
        apply: 'Appliquer',
        giftCardEndingIn: 'Carte-cadeau se terminant par',
        hasBeenApplied: 'a été appliqué',
        removeLink: 'Retirer',
        cancelLink: 'Annuler',
        cancelText: 'Tout compte fait, je ne souhaite pas ajouter de carte-cadeau',
        removeGiftCard: 'Supprimer la carte-cadeau',
        areYouSureMessage: 'Êtes-vous sûr de vouloir supprimer cette carte-cadeau de façon définitive?',
        moreInfoTitle: 'Utiliser une carte-cadeau ou une carte-cadeau électronique Sephora'
    };

    return resources[label];
}
