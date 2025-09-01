export default function getResource(label, vars = []) {
    const resources = {
        myRecentReviews: 'My Recent Reviews',
        recentReviews: 'Recent Reviews',
        readMore: 'read more',
        userRating: 'My rating',
        nicknameRating: `${vars[0]}’s rating`
    };
    return resources[label];
}
