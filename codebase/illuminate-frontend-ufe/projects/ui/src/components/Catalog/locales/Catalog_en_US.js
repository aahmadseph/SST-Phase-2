const resources = {
    result: 'Result',
    results: 'Results',
    resultsFor: 'for',
    showMoreProducts: 'Show More Products',
    relatedContent: 'Related Content',
    showMore: 'Show more',
    showLess: 'Show less',
    browseMore: 'Browse More in',
    of: 'of',
    shopByCategory: 'Shop by Category',
    default: 'Default',
    sort: 'Sort',
    relevancy: 'Relevance',
    bestselling: 'Bestselling',
    topRated: 'Top Rated',
    exclusive: 'Exclusive',
    new: 'New',
    priceDesc: 'Price High to Low',
    priceAsc: 'Price Low to High',
    brandName: 'Brand Name',
    clearAll: 'Clear all',
    andAbove: 'and above',
    featuredContent: 'Featured Content',
    yourBeautyPreferences: 'Your Beauty Preferences'
};

export default function getResource(label) {
    return resources[label];
}
