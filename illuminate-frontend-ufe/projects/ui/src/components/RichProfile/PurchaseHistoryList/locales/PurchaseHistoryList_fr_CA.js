
export default function getResource(label, vars = []) {
    const resources = {
        buyItAgain: 'Acheter de nouveau',
        signInMessage: 'Vous devez ouvrir une session pour consulter cette page.',
        signInMessageDescription: 'Ouvrez une session et découvrez une nouvelle manière d’organiser vos achats en ligne et en magasin.',
        beautyMemberMessage: 'Vous devez être membre Beauty Insider',
        beautyMemberMessageBr: 'pour consulter vos achats passés.',
        signIn: 'Ouvrir une session',
        joinNow: 'S’inscrire',
        purchaseHistorySortDescription: 'DescriptionTriHistorique de l’achat',
        sortDescribedById: 'DescriptionTriHistorique de l’achat',
        sortDescribedByText: 'À la sélection de l’option de filtre, les produits affichés seront automatiquement mis à jour pour correspondre à l’option de filtre choisie.',
        filterDescribedById: 'DescriptionFiltreHistorique de l’achat',
        filterDescribedByText: 'À la sélection de l’option de filtre, les produits affichés seront automatiquement mis à jour pour correspondre à l’option de filtre choisie.',
        replenItemsCarouselTitle: 'Réapprovisionner les achats antérieurs'
    };
    return resources[label];
}
