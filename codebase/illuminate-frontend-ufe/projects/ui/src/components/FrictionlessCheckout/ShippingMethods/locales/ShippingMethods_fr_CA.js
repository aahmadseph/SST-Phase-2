export default function getResource(label, vars = []) {
    const resources = {
        free: 'Gratuit',
        getItShipped: 'Faites livrer',
        items: 'Articles',
        title: 'Mode d’expédition',
        shipping: 'Livraison',
        autoReplenish: 'Réapprovisionnement automatique',
        deliveryFrequency: 'Fréquence de livraison',
        chooseThisShippingSpeed: 'Choisissez cette vitesse d’expédition',
        shippingMethodType: 'Standard',
        expeditedText: 'Les options d’expédition express ne s’appliquent qu’à la première livraison. Les articles à réapprovisionnement automatique subséquents arriveront par expédition standard.',
        changeShippingMethod: 'Modifier le mode d’expédition',
        waived: 'Exonéré',
        waiveShippingHandling: 'Exonérer les frais d’expédition et de manutention'
    };

    return resources[label];
}
