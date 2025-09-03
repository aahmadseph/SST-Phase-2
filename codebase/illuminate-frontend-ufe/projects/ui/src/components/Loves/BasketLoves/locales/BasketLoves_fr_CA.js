export default function getResource(label, vars = []) {
    const resources = {
        basketLovesListTitle: 'Votre liste de coups de cœur vous attend!',
        basketLovesListSignInCTA: 'Ouvrez une session et découvrez une nouvelle manière d’acquérir vos produits de beauté préférés et d’organiser vos achats en ligne et en magasin.',
        emptyLovesTitle: 'Vous n’avez encore aimé aucun produit!',
        emptyLovesText: 'Rassemblez tous vos produits de beauté et ceux à essayer absolument en cliquant sur le',
        whileYouShopText: 'pendant votre magasinage.',
        viewLovesText: 'Afficher les coups de cœur',
        yourLovesText: 'Vos coups de cœur',
        signInText: 'Ouvrir une session'
    };

    return resources[label];
}
