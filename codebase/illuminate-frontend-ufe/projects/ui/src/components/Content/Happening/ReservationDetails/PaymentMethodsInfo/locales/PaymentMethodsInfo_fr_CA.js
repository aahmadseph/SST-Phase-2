export default function getResource(label, vars=[]){
    const resources = {
        payment: 'Paiement',
        estimatedCost: 'Coût estimé',
        taxesHit: '*taxes fédérales et provinciales non affichées',
        paymentHold: 'Mode de paiement en attente',
        paymentUsed: 'Mode de paiement utilisé',
        paymentMethodsUsed: 'Modes de paiement utilisés',
        servicePayment: 'Paiement du service',
        noShowFee: 'Frais d’absence',
        lateCancellationFee: 'Frais d’annulation tardive',
        tip: 'Conseils',
        viewPolicies: 'Afficher les politiques',
        refund: `– Remboursement de ${vars[0]} $`,
        CARD: 'Carte',
        ONLINE_CREDIT: 'Crédit en ligne'
    };
    return resources[label];
}
