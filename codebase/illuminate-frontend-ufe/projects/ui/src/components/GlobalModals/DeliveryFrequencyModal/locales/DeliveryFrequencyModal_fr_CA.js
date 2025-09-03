export default function getResource(label, vars = []) {
    const resources = {
        chooseDeliveryFreq: 'Livrer chaque :',
        mostCommon: 'Le plus courant',
        youWillSave: 'vous économiserez',
        annualyWithSubs: 'chaque année avec cet abonnement.',
        save: 'Enregistrer',
        cancel: 'Annuler',
        frequencyNumber: 'Nombre de fréquence',
        frequencyType: 'Type de fréquence',
        item: 'ARTICLE',
        actualPrice: 'Prix réel',
        originalPrice: 'Prix initial',
        months: 'Mois',
        legalCopy1: 'de réduction sur vos premières',
        legalCopy2: 'livraisons.',
        legalCopy3: 'Voir le produit pour connaître les détails.',
        firstYearSavings: 'au cours de la première année de votre abonnement.',
        lastDeliveryLeft: `livraison restante à ${vars[0]} % de réduction`,
        deliveriesLeft: `livraisons restantes à ${vars[0]} % de réduction`,
        discountValidUntil: `Réduction en vigueur jusqu’au ${vars[0]}`,
        discountsValidUntil: `Réductions en vigueur jusqu’au ${vars[0]}`
    };

    return resources[label];
}
