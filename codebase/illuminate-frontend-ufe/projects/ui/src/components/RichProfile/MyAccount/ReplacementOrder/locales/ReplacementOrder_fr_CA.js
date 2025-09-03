export default function getResource(label, vars = []) {
    const resources = {
        mainTitle: 'Commande de remplacement',
        shippingAddressTitle: 'Adresse de livraison',
        deliveryTitle: 'Livraison',
        itemsTitle: 'Articles',
        orderSubtotalPlusTax: 'Sous-total de la commande et taxes estimées',
        oneTimeReplacement: 'Remplacement unique',
        shippingAndHandling: 'Expédition et manutention',
        orderTotal: 'Total de la commande',
        itemSingular: 'article',
        itemPlural: 'articles',
        terms: 'J’ai examiné et vérifié mon adresse d’expédition. Je comprends que je ne peux pas apporter de modifications à mon adresse d’expédition une fois que j’ai passé ma commande de remplacement et que je ne peux pas demander un autre remplacement pour cette commande.',
        submitForReview: 'Soumettre pour vérification',
        selectSamplesText: 'Choisissez jusqu’à 2 échantillons gratuits',
        sessionExpired: 'Session expirée',
        sessionExpiredMessage: 'Oups! Votre session a expiré et vous serez redirigé vers les détails de la commande.',
        ok: 'OK'

    };

    return resources[label];
}
