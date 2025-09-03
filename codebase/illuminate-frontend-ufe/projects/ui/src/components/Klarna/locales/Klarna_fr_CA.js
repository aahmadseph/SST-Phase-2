export default function getResource(label, vars = []) {
    const resources = {
        installmentsWithAfterpayAndKlarna: `ou quatre paiements de ${vars[0]} avec`,
        boldInstallmentsWithAfterpayAndKlarna: `ou *quatre paiements de ${vars[0]}* avec`,
        or: 'ou ',
        testCardDiscount: `or ${vars[0]} off your Sephora order when you open and use a Sephora Credit Card today.¹`,
        test: 'Obtenez 2x les points Beauty Insider pour chaque dollar dépensé avec votre carte de crédit Sephora chez Sephora.',
        testSeeDetails: 'Voir les détails',
        learnMore: 'En savoir plus',
        openBuyNowPayLater: `Ouvrir la modalité acheter maintenant payer plus tard ${vars[0]}`
    };

    return resources[label];
}
