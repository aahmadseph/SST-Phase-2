export default function getResource(label, vars = []) {
    const resources = {
        noLoves: 'Vous n’avez ajouté aucun produit à votre liste de Coups de cœur.',
        collectAllYourFavorites: 'Collectionnez tous vos produits de beauté favoris et ceux à essayer absolument en cliquant sur le',
        whileYouShop: 'pendant votre magasinage.',
        youHaveToSignIn: 'Vous devez ouvrir une session pour consulter cette page.',
        signInToViewAllYourFav: 'Ouvrez une session pour voir tous vos articles favoris dans la Liste Coups de cœur.',
        signIn: 'Ouvrir une session',
        sharedLoves: 'Coups de cœur partagés',
        loves: 'Favoris',
        share: 'Partager',
        showMore: 'Afficher plus',
        copyLinkAndShare: 'Copiez le lien suivant et partagez-le avec vos amis :',
        yourLoves: 'vos favoris',
        sortDescribedByText: 'À la sélection de l’option de filtre, les produits affichés seront automatiquement mis à jour pour correspondre à l’option de filtre choisie.',
        getTheseBeforeTheyAreGone: 'Procurez-vous-les avant qu’ils ne partent',
        recentlyLoved: 'Récemment aimé'
    };
    return resources[label];
}
