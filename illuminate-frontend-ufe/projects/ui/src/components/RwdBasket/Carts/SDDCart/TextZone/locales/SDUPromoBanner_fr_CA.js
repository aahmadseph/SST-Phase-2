export default function getResource(label, vars = []) {
    const resources = {
        getSDD: `Profitez de la livraison ${vars[0]} le jour même`,
        free: 'GRATUIT',
        startSavingWithSDU: `Commencez à économiser avec un ${vars[0]} à la livraison le jour même illimitée de Sephora.`,
        free30DayTrial: 'essai GRATUIT de 30 jours',
        tryNowForFree: 'Essayez-la gratuitement',
        getFreeSDD: 'Profitez de la livraison GRATUITE le jour même',
        startSavingWithSephoraSDU: 'Commencez à économiser avec la livraison le jour même illimitée de Sephora.',
        signUp: 'S’inscrire'
    };

    return resources[label];
}
