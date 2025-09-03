export default function getResource(label, vars = []) {
    const resources = {
        mostPositiveReview: 'Most Helpful Positive Review',
        mostNegativeReview: 'Most Helpful Critical Review',
        mostHelpfulReview: 'Most Helpful Review',
        ratingsReviews: 'Ratings & Reviews',
        writeReview: 'Write a review',
        reviewsFromTo: `Viewing ${vars[0]}-${vars[1]} of ${vars[2]} reviews`,
        searchResult: `${vars[0]} Review Containing “${vars[1]}”`,
        searchResults: `${vars[0]} Reviews Containing “${vars[1]}”`,
        noSearchResult: `Sorry, no reviews contain “${vars[0]}”`,
        noReview: 'Sorry, no reviews match the selected filters. Please try removing some filters.',
        page: 'Page',
        nextPage: 'Next page',
        previousPage: 'Previous page'
    };
    return resources[label];
}
