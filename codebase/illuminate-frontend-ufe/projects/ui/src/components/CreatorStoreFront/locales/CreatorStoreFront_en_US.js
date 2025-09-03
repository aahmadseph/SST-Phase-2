export default function getResource(label, vars = []) {
    const resources = {
        share: 'Share',
        sharePost: 'Share Post',
        shareProfile: 'Share Profile',
        shareProduct: 'Share Product',
        shareCollection: 'Share Collection',
        copyLinkText: 'Copy the link and share it with friends:',
        copy: 'Copy',
        copied: 'Copied!',
        allProducts: 'All Products',
        featuredHeader: 'Featured',
        featured: 'Featured',
        products: 'Products',
        collections: 'Collections',
        posts: 'Posts',
        viewDetails: 'View Details',
        showMoreCollections: 'Show More Collections',
        items: 'items',
        addToBasket: 'Add to Basket',
        moreFrom: 'More from',
        viewAll: 'View all',
        shopWith: 'Shop with',
        goToProfile: 'Go to Profile',
        postsOf: `${vars[0]}'s Posts`,
        commissionableLinks: 'Contains Commissionable Links'
    };

    return resources[label];
}
