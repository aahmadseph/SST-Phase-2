export default function getResource(label, vars = []) {
    const resources = {
        mostPositiveReview: 'Commentaire positif le plus utile',
        mostNegativeReview: 'Commentaire critique le plus utile',
        mostHelpfulReview: 'Commentaire le plus utile',
        ratingsReviews: 'Évaluations et commentaires',
        writeReview: 'Rédiger un commentaire',
        reviewsFromTo: `Commentaires ${vars[0]}–${vars[1]} sur ${vars[2]}`,
        searchResult: `${vars[0]} Commentaire contenant « ${vars[1]} »`,
        searchResults: `${vars[0]} Commentaires contenant « ${vars[1]} »`,
        noSearchResult: `Désolés, aucun commentaire contenant « ${vars[0]} »`,
        noReview: 'Désolé, aucun avis ne correspond aux filtres appliqués. Essayez de retirer certains filtres.',
        page: 'Page',
        nextPage: 'Page suivante',
        previousPage: 'Page précédente'
    };
    return resources[label];
}
