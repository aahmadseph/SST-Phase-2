export default function getResource(label, vars = []) {
    const resources = {
        sephoraCard: 'Carte Sephora',
        sephoraTempCard: 'Carte temporaire Sephora',
        sephoraVisaCard: 'Carte VISA Sephora',
        sephoraVisaTempCard: 'Carte temporaire Visa Sephora',
        creditCardEncryptionErrorMessage: 'Nous éprouvons des problèmes de connexion avec ce mode de paiement. Veuillez réessayer plus tard ou utiliser un autre mode de paiement.'
    };

    return resources[label];
}
