export default function getResource(label, vars = []) {
    const resources = {
        loves: 'Favoris',
        signInButton: 'Ouvrir une session',
        createAccountButton: 'Créer un compte',
        recentlyLoved: 'Récemment aimé',
        viewAll: 'Tout afficher',
        shopNow: 'Magasiner',
        itemShip: 'Cet article ne peut pas être expédié vers le pays suivant',
        noLovesDesc: 'Utilisez votre liste de favoris pour faire le suivi de vos produits préférés.',
        noLovesMyListDesc: 'Ouvrez une session pour organiser et partager vos essentiels enregistrés.',
        myLists: 'Mes listes',
        getTheseBeforeTheyAreGone: 'Procurez-vous-les avant qu’ils ne partent',
        onSaleNow: 'En solde maintenant',
        lookingForFavBrands: 'Vous cherchez vos marques préférées?',
        goToBeautyPrefs: 'Aller aux préférences beauté',
        item: 'article',
        items: 'articles',
        recentlyAdded: 'Ajouté récemment',
        noLovesAdded: 'Vous n’avez rien enregistré dans vos listes. Appuyez sur le cœur à côté des essentiels qui vous intéressent et choisissez une liste à laquelle les ajouter.',
        browse: 'Parcourir les produits',
        recentLists: 'Listes récentes',
        savedIn: 'Enregistré dans',
        and: 'et'
    };
    return resources[label];
}
