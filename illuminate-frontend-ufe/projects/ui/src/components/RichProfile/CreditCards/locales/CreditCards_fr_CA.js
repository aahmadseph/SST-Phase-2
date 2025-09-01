export default function getResource(label, vars = []) {
    const resources = {
        myCardSummary: 'Sommaire de ma carte de crédit',
        manageMyCard: 'Payer ma facture',
        yourRewards: 'Vos récompenses',
        availableNow: 'Disponible dès maintenant',
        scanInStore: 'Balayer les cartes de récompense en magasin',
        applyInBasket: 'Appliquer les récompenses dans le panier',
        available: 'Disponible',
        availableTime: 'Ces récompenses seront disponibles à la fin de votre prochaine période de facturation.',
        earningNextStatement: 'Obtention des primes sur le prochain relevé',
        yearToDate: 'Depuis le début de l’année',
        rewardsEarned: 'Récompenses obtenues',
        rewardsBreakdown: 'Répartition des récompenses',
        creditCardReward: 'Récompense carte de crédit',
        appliedToBasket: 'Appliquer au panier',
        remove: 'Retirer',
        underReview: 'Votre demande de carte de crédit est en cours d’examen.',
        decorativeBannerImage: 'bannière décorative',
        reviewMessage: 'Veuillez patienter. Comenity Capital Bank examine actuellement votre demande et vous recevrez une réponse par la poste dans les 10 jours ouvrables. Merci de votre patience.',
        notActive: 'Compte inactif.',
        questions: 'Des questions? Nous sommes toujours là pour vous.',
        callCustomerSupport: 'Appelez le service à la clientèle au',
        ttdTty: 'ATS',
        expired: 'Exp.',
        giveTry: 'Essayez-les...',
        asOf: 'En date du'
    };

    return resources[label];
}
