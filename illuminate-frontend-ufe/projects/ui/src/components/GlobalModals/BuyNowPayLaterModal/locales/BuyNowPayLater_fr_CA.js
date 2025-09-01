export default function getResource(label, vars = []) {
    const resources = {
        close: 'Fermer',
        shopNow: 'Magasinez maintenant, payez plus tard',
        klarnaTitle: 'Acheter. Payez avec Klarna à votre rythme.',
        klarnaDescription: 'Obtenez ce que vous aimez, choisissez comment vous payez.',
        klarnaInstructions: 'À la caisse, sélectionnez Klarna | Choisissez votre méthode de paiement | Finalisez votre paiement | Le montant sera facturé en fonction de la méthode de paiement que vous avez choisie',
        klarnaTerms: 'Un paiement initial plus élevé peut être requis dans certains cas. Résidents de la Californie : Prêts accordés ou mis en place conformément à une licence délivrée en vertu de la California Financing Law. Voir les modalités',
        klarnaTermsLink: 'de paiement',
        afterpayTitle: 'Magasiner. Choisissez votre méthode de paiement.',
        afterpayDescription: '',
        afterpayUSInstructions: 'Magasiner. Payez en quatre versements. Toujours sans intérêt.| Ajoutez vos favoris au panier|  Sélectionnez Cash App pour Afterpay à la caisse| Ouvrez une session ou créez votre compte Cash App pour Afterpay (approbation instantanée)| Votre achat sera divisé en quatre paiements, payables toutes les deux semaines.',
        afterpayInstructions: 'Ajoutez vos favoris au panier | Sélectionnez Afterpay à la caisse|  Choisissez un paiement mensuel ou en quatre versements sans intérêt.* | Obtenez la souplesse dont vous avez besoin lorsque vous payez au fil du temps.',
        afterpayTerms: 'Vous devez avoir 18 ans ou plus, être résident(e) des États-Unis et répondre à des critères d’admissibilité additionnels. Des frais de retard peuvent s’appliquer.',
        afterpayTerms2: 'Les montants de paiement estimés indiqués sur les pages de produits excluent les taxes et les frais d’expédition, qui sont ajoutés au moment du paiement.',
        afterpayTerms3: 'pour connaître toutes les modalités.',
        afterpayTerms4: 'Prêts accordés aux résidents de la Californie ou mis en place conformément à une licence délivrée en vertu de la California Finance Lenders Law.',
        afterpayTerms5: '@ Afterpay US, 2022',
        afterpayTermsLink: 'Cliquez ici',
        paypalTitle: 'Payez en quatre versements sans intérêt.',
        paypalDescription: '',
        paypalInstructions: 'Choisissez PayPal à la caisse pour payer plus tard avec l’option *Payer en quatre versements* | Finalisez votre achat avec un versement initial de 25 % | Utilisez le paiement automatique pour le reste de vos paiements aux deux semaines. C’est facile!',
        paypalTerms: 'Le paiement en quatre versements est offert aux consommateurs après approbation pour les achats de 30 $ à 1 500 $. Le paiement en quatre versements n’est actuellement pas offert aux résidents du Missouri et du Nevada. La disponibilité de l’offre dépend du commerçant et peut également ne pas être proposée pour certains services d’abonnement récurrents. Lorsque vous faites une demande, une vérification de crédit souple peut être nécessaire, mais elle n’aura aucune incidence sur votre cote de crédit. Vous devez avoir 18 ans ou plus pour faire une demande. PayPal, Inc. : Les prêts aux résidents de la Californie sont effectués ou organisés conformément à une licence délivrée en vertu de la California Financing Law. Titulaire d’une licence de prêteur pour les crédits à tempérament de l’État de Géorgie, NMLS #910457. Titulaire d’une licence de prêteur pour les crédits à la consommation du Rhode Island. Résidents du Nouveau-Mexique :',
        paypalTerms2: 'en lien avec le paiement en quatre versements.',
        paypalTermsLink: 'Plus de divulgations',
        paypalSubtitle: `Divisez votre achat de ${vars[0]} $ en quatre versements de ${vars[1]} $ toutes les deux semaines, sans incidence sur votre cote de crédit et sans frais de retard.`,
        learnMore: 'En savoir plus',
        gotIt: 'Compris'
    };

    return resources[label];
}
