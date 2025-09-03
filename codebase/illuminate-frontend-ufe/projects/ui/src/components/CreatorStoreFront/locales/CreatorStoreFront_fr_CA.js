export default function getResource(label, vars = []) {
    const resources = {
        share: 'Partager',
        sharePost: 'Partager la publication',
        shareProfile: 'Partager le profil',
        shareProduct: 'Partager l’essentiel',
        shareCollection: 'Partager la collection',
        copyLinkText: 'Copiez le lien suivant et partagez-le avec vos ami(e)s :',
        copy: 'Copier',
        copied: 'Copié!',
        allProducts: 'Tous les produits',
        featuredHeader: 'Offres en vedette',
        featured: 'Offres en vedette',
        products: 'Produits',
        collections: 'Collections',
        posts: 'Publications',
        viewDetails: 'Voir les détails',
        showMoreCollections: 'Afficher plus de collections',
        items: 'articles',
        addToBasket: 'Ajouter au panier',
        moreFrom: 'Plus de',
        viewAll: 'Tout afficher',
        shopWith: 'Magasiner avec',
        goToProfile: 'Aller au profil',
        postsOf: `Publications de ${vars[0]}`,
        commissionableLinks: 'Contient des liens donnant droit à commission'
    };

    return resources[label];
}
