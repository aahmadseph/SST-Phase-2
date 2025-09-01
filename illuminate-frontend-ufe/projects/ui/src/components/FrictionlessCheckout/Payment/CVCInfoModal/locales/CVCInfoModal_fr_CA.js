export default function getResource(label) {
    const resources = {
        cvcInfoTitle: 'Code de vérification de la carte de crédit',
        visaCardCustomers: 'Clients Visa/MC/Discover',
        yourSecurityCodeMsg:
            'Votre code de sécurité/numéro d’identification de carte se trouve près du champ de signature au dos de votre carte de crédit. (Il s’agit des trois derniers chiffres qui apparaissent APRÈS le numéro de compte de la carte de crédit) Les numéros d’identification des cartes Visa/MC/Discover comptent 3 caractères.',
        backOfCard: 'Dos de la carte Visa/MC/Discover',
        amexCustomers: 'Clients American Express',
        yourCodeAmexMsg:
            'Le code de sécurité/numéro d’identification de carte est composé de 4 caractères et est inscrit sur le devant de la carte, AU-DESSUS du numéro de carte de crédit embossé. Ce numéro est appelé « code de sécurité ». Les numéros d’identification de carte American Express comptent 4 caractères.',
        frontOfAmexCard: 'Devant d’une carte American Express',
        visaCardAltText: 'Dos d’une carte de crédit Visa indiquant l’emplacement du code de sécurité à trois chiffres',
        amexCardAltText: 'Devant d’une carte de crédit American Express indiquant l’emplacement du code de sécurité à quatre chiffres'
    };

    return resources[label];
}
