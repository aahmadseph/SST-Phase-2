export default function getResource(label) {
    const resources = {
        title: 'Fermer le compte',
        checkboxText: 'Je comprends que je perds les avantages du programme Beauty Insider ci-dessus',
        cancelButton: 'Annuler',
        listTitleText: 'Veuillez noter qu’une fois que votre compte Sephora sera fermé, les avantages suivants seront immédiatement touchés :',
        item1: '1. Vous ne pourrez plus vous connecter à votre compte, et les conseillers et conseillères beauté ne pourront pas accéder à votre compte dans les magasins Sephora.',
        item2: '2. Vous perdrez tous vos points Beauty Insider actuels, votre échelon et vos avantages.',
        item3: '3. Vous n’accumulerez plus de points Beauty Insider sur vos achats.',
        item4: '4. Vous perdrez l’accès à votre compte de la collectivité, y compris la possibilité de publier des évaluations de produits, de téléverser des photos, de participer à des forums ou à des groupes ou de répondre à des questions sur les produits.',
        item5: '5. Vous serez retiré de tous les services marketing de Sephora, y compris les courriels, les textos et les notifications. (Veuillez prévoir jusqu’à 12 heures pour que cela entre en vigueur.)',
        item6: '6. Tout compte lié à votre compte Sephora (Kohl’s, Doordash, Instacart, Facebook, Shipt) sera dissocié.',
        item7: '7. Si vous avez des articles à réapprovisionnement automatique, toute expédition qui n’a pas été expédiée sera annulée et l’inscription au réapprovisionnement automatique prendra fin.',
        item8: '8. Si vous êtes abonné à la livraison le jour même illimitée, votre abonnement prendra fin sans remboursement et le renouvellement annuel sera annulé.',
        postListText: 'La fermeture de votre compte Sephora n’aura aucune incidence sur les commandes en cours, les retours et les rendez-vous de service payés. In addition, if you have the Sephora Credit Card, you will be able to continue to use the credit card and check balances on the bank’s website, and you will continue to receive bank rewards for qualifying purchases.'
    };
    return resources[label];
}

