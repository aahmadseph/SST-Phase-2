export default function getResource(label, vars = []) {
    const resources = {
        search: 'Search',
        cancel: 'Cancel',
        previousSearches: 'Previous Searches',
        clearInputAriaLabel: 'clear search input text',
        trendingCategories: 'Trending Categories',
        searchSuggestions: 'Search Suggestions',
        productSuggestions: 'Product Suggestions',
        continueBrowsing: 'Continue Browsing',
        buyItAgain: 'Buy It Again'
    };

    return resources[label];
}
