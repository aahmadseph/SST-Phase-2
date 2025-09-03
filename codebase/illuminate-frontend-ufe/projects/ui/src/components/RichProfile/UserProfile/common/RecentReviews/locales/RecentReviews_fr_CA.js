export default function getResource(label, vars = []) {
    const resources = {
        myRecentReviews: 'Mes commentaires récents',
        recentReviews: 'Commentaires récents',
        readMore: 'en lire plus',
        userRating: 'Mon évaluation',
        nicknameRating: `Cote de ${vars[0]}`
    };
    return resources[label];
}
