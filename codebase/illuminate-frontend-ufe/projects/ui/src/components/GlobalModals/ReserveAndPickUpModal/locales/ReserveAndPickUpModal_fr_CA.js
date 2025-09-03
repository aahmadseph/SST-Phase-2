export default function getResource(label, vars = []) {
    const resources = {
        pickUpInStore: 'Ramassez en magasin',
        chooseThisStore: 'Choisissez ce magasin',
        notAbleToFind: `Nous n’avons pas été en mesure de trouver un magasin près de « ${vars[0]} ».`,
        differentLocation: 'Veuillez essayer un autre emplacement.',
        ok: 'OK',
        changeStoreTitle: 'Changer de magasin',
        changeStoreMessage: 'Le lieu de ramassage sera maintenant :',
        changeStoreMessage2: 'pour tous les articles à ramasser',
        anyPromosRewardsMsg:
            'De plus, toute promotion ou récompense dans votre panier d’articles à ramasser en sera retirée. Vous pouvez ajouter des promotions et des récompenses en magasin, s’il y a lieu.',
        changeItemQtyMsg: 'La quantité sera mise à jour à 1 pour tous les articles à ramasser.'
    };

    return resources[label];
}
