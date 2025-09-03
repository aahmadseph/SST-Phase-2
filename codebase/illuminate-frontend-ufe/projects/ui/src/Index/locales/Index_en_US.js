module.exports = function getResource(label, vars = []) {
    const resources = {
        metaTitleBeautyStore: `Beauty Store & Services in ${vars[0]} | Sephora ${vars[1]}`,
        metaDescVisitSephora: `Visit Sephora ${vars[0]} in ${vars[1]}, ${vars[2]}. Shop our  selection of beauty products from top brands, pop in for a makeover, sign up for beauty classes and more.`,
        metaDescFindAll: 'Find all the beauty departments you’ve dreamed of at Sephora. Quickly navigate through our unrivaled selection of makeup, skin care, fragrance and more from classic and emerging brands',
        buyPageDescription: `${vars[0]} are available now at Sephora! Shop ${vars[0]} and find the best fit for your beauty routine. Free shipping and samples available.`,
        galleryPageTitle: 'Trending Beauty Photo and Video Gallery | Sephora',
        galleryPageDescription: 'Looking for trending beauty inspiration? Check out photos and videos from Sephora customers and upload your own on Sephora\'s Gallery!'
    };
    return resources[label];
};
