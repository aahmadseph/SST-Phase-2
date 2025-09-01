export default function getResource(label) {
    const resources = {
        title: 'Ajouter un message',
        subTitleScreen1: 'Choisir votre modèle',
        subTitleScreen2: 'Rédiger votre message',
        subTitleScreen3: 'Prévisualiser votre message',
        next: 'Suivant',
        back: 'Retour',
        preview: 'Aperçu',
        recipientName: 'Nom du destinataire',
        yourName: 'Votre nom',
        recipientEmailAddress: 'Adresse électronique du destinataire',
        giftMessage: 'Message du cadeau (facultatif)',
        enterRecipientNameError: 'Veuillez entrer le nom du destinataire du cadeau.',
        enterYourNameError: 'Veuillez saisir votre nom.',
        invalidNameError: 'Nom invalide : Le nom de famille doit comprendre seulement des lettres et un maximum de 31 caractères',
        enterRecipientEmailAddressError: 'Veuillez entrer l’adresse courriel du destinataire du cadeau.',
        invalidRecipientEmailAddressError: 'Veuillez saisir une adresse courriel au format de username@domain.com.',
        giftMessageTimingMsg: 'Votre destinataire recevra un courriel contenant votre message cadeau et une date de livraison estimée après l’expédition de la commande.',
        toText: 'À',
        fromText: 'De',
        save: 'Enregistrer',
        errorMessageRequest: 'Une erreur s’est produite, veuillez réessayer'
    };

    return resources[label];
}
