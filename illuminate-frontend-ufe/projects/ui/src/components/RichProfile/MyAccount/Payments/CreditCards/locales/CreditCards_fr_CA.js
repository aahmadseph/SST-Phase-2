export default function getResource(label, vars = []) {
    const resources = {
        thisCardHasExpired: 'Cette carte est expirée. Veuillez effectuer une mise à jour des renseignements de votre carte.',
        defaultCreditCard: 'Carte par défaut',
        makeDefaultCreditCard: 'Définir comme carte par défaut',
        edit: 'Modifier',
        addCreditCard: 'Ajouter une carte de crédit ou de débit',
        cardDescText: `${vars[0]} se terminant par ${vars[1]}`,
        cardExpirationText: `Expiration ${vars[0]} ${vars[1]}`,
        debitCardDisclaimer: 'Cartes de débit Visa et Mastercard seulement',
        gotIt: 'Compris',
        accountUpdateModal: 'Mise à jour du compte',
        defaultCardErrorModal: 'Impossible de définir cette carte comme carte par défaut pour le moment. Veuillez réessayer plus tard.',
        deleteCardErrorModal: 'Impossible de supprimer cette carte pour le moment. Veuillez réessayer plus tard.',
        done: 'Terminé',
        ok: 'O.K.'
    };
    return resources[label];
}
