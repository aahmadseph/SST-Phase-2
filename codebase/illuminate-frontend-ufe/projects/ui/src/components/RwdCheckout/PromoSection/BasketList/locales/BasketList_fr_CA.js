export default function getResource(label, vars = []) {
    const resources = {
        itemsInBasketMessage: `Faites livrer (${vars[0]})`,
        emptyBasketMessage: 'Votre panier est actuellement vide.',
        shopNewArrivals: 'Découvrir les nouveautés',
        pleaseSignIn: `Veuillez ${vars[0]} si vous essayez de récupérer un panier créé précédemment.`,
        signInText: 'ouvrir une session',
        emptyRopisBasketTitle: 'Vider le panier',
        emptyRopisBasket: 'Votre panier Réservation et cueillette est vide. Vous serez dirigé vers votre panier de commandes en ligne',
        ok: 'OK',
        gotIt: 'Compris',
        undo: 'Annuler',
        itemMoved: 'Article déplacé',
        gotIt2: 'Compris',
        emptyBasket: 'Vider le panier',
        emptyPickupBasket: 'Votre panier « Achetez en ligne et ramassez en magasin » est vide. Vous serez dirigé vers votre panier d’articles à livrer.',
        emptyDcBasket: 'Votre panier d’articles à livrer est vide. Vous serez dirigé vers votre panier « Achetez en ligne et ramassez en magasin ».',
        emptyStandardBasketMessage: 'Vous n’avez pas d’articles pour la livraison standard.',
        rougeMemberFreeSameDayDeliveryMessage: 'En tant que membre Rouge, vous pouvez essayer gratuitement la livraison le jour même!',
        rougeMemberFreeSameDayDeliveryBoxTitle: 'Vous voulez vos articles aujourd’hui?',
        rougeMemberFreeSameDayDeliveryBoxText:
            'Rouge members can also try Free Same-Day Delivery! Check availability by tapping the "Bouton « Changer le mode ».',
        rougeMemberFreeSameDayDeliveryBoxTextEmptyBasket:
            'Rouge members can also try Free Same-Day Delivery! Check availability by selecting "« Livraison le jour même » sur la page du produit.',
        sddRougeTestV2MessageEmptyBasket: `Les membres Rouge peuvent aussi profiter la livraison le jour même gratuite avec toute commande de ${vars[0]} $ ou plus! Vérifiez la disponibilité en sélectionnant « Livraison le jour même » sur la page du produit.`,
        sddRougeTestV2MessageStandard: `Les membres Rouge peuvent aussi profiter la livraison le jour même gratuite avec toute commande de ${vars[0]} $ ou plus! Vérifiez la disponibilité en appuyant sur le bouton « Changer de méthode ».`,
        sddRougeTestV2Message: `En tant que membre Rouge, profitez de la livraison le jour même GRATUITE en ajoutant ${vars[0]}.`,
        sddRougeTestV2FreeShippingMessage: 'En tant que membre Rouge, vous pouvez essayer la livraison le jour même GRATUITE.',

        //BasketListItem
        shippingRestrictionPopoverText:
            'En raison des réglementations d’expédition, cet article et le reste de votre commande doivent être expédiés par voie terrestre (livraison en 2 à 8 jours au total). Cela comprend les commandes accélérées.',
        shippingRestrictions: 'Restrictions d’expédition',
        rewardCardText:
            'La récompense Rouge est valable pour *une transaction future uniquement*; elle *expirera dans 90 jours* et sera envoyée par courriel dans les *24 heures*.',
        remove: 'Retirer',
        moveToLoves: 'Déplacer vers les favoris',
        loved: 'Coup de cœur',
        outOfStock: 'Rupture de stock',
        outOfStockAtStore: 'Rupture de stock dans certains magasins',
        soldOut: 'Rupture de stock',
        changeMethod: 'Changer la méthode',
        getItSooner: 'Obtenez-le plus rapidement',
        free: 'GRATUIT',
        sephoraSubscription: 'Abonnement Sephora'
    };

    return resources[label];
}
