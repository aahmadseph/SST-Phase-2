export default function getResource(label, vars = []) {
    const resources = {
        acceleratedPromotionTermsText1: `*Offre valable uniquement pour les nouveaux abonnés. Pour chaque produit en super aubaine, l’abonnement et le nombre d’unités sont limités à 1 par membre de la clientèle. Les réductions expirent ${vars[0]} mois après l’inscription initiale.`,
        acceleratedPromotionTermsText2: `Après ${vars[0]} commandes au montant plus élevé ou passées ${vars[1]} mois après la date d’inscription initiale, selon ce qui arrive en premier, l’abonnement se renouvelle avec une réduction de ${vars[2]} %.`,
        acceleratedPromotionTermsText3: `L’offre prend fin le ${vars[0]}.`
    };

    return resources[label];
}
