export default function getResource(label, vars = []) {
    const resources = {
        remove: 'Retirer',
        cancel: 'Annuler',
        edit: 'Modifier',
        cvc: 'CVV/CVC',
        moreInfoCvc: 'Plus d’informations relatives au CVC',
        expiredCreditCardMsg: 'Cette carte est expirée. Veuillez effectuer une mise à jour des renseignements de votre carte.',
        cvcInfoTitle: 'Code de vérification de la carte de crédit',
        visaCardCustomers: 'Clients Visa/MC/Discover',
        yourSecurityCodeMsg:
            'Votre code de sécurité/numéro d’identification de carte se trouve près du champ de signature au dos de votre carte de crédit. (Il s’agit des trois derniers chiffres qui apparaissent APRÈS le numéro de compte de la carte de crédit) Les numéros d’identification des cartes Visa/MC/Discover comptent 3 caractères.',
        backOfCard: 'Dos de la carte Visa/MC/Discover',
        amexCustomers: 'Clients American Express',
        yourCodeAmexMsg:
            'Le code de sécurité/numéro d’identification de carte est composé de 4 caractères et est inscrit sur le devant de la carte, AU-DESSUS du numéro de carte de crédit embossé. Ce numéro est appelé « code de sécurité ». Les numéros d’identification de carte American Express comptent 4 caractères.',
        frontOfAmexCard: 'Devant d’une carte American Express',
        addNewCreditCard: 'Ajouter une nouvelle carte de crédit ou de débit',
        showMoreCards: 'Voir plus de cartes',
        showLessCards: 'Voir moins de cartes',
        giftCardsNotCombinableText: `Les cartes-cadeaux ne peuvent être combinées à ${vars[0]}. Si vous voulez utiliser une carte-cadeau, veuillez choisir un autre mode de paiement.`,
        payWithCreditOrDebitCard: 'Payez avec une carte de crédit ou de débit',
        visaOrMastercard: 'Cartes de débit Visa et Mastercard seulement',
        editPaypal: 'Modifier',
        paypalRestrictedItemError:
            'L’un des articles de votre panier ne peut pas être acheté avec Paypal. Veuillez supprimer l’article pour payer avec Paypal ou bien utilisez un autre mode de paiement pour passer à la caisse avec cet article.',
        removeAddress: 'Supprimer l’adresse',
        maxCreditCardsMessage: `Vous pouvez avoir jusqu’à ${vars[0]} cartes de crédit. Veuillez en supprimer une et en ajouter une autre à nouveau.`,
        continueButton: 'Continuer',
        removeCreditCard: 'Supprimer la carte de crédit ou la carte de débit',
        areYouSureMessage: 'Êtes-vous sûr de vouloir supprimer cette carte de façon définitive?',
        debitCardDisclaimer: 'Cartes de débit Visa et Mastercard seulement',
        setAsDefaultPayment: 'Définir en tant qu’adresse par défaut',
        setAsDefaultPaymentNotice: 'Définir comme par défaut est enregistré uniquement lorsque le paiement est terminé.',
        gotIt: 'Compris'
    };

    return resources[label];
}
