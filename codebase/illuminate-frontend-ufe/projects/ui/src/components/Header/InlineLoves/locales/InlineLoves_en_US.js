export default function getResource(label, vars = []) {
    const resources = {
        loves: 'Loves',
        signInButton: 'Sign In',
        createAccountButton: 'Create Account',
        recentlyLoved: 'Recently Loved',
        viewAll: 'View all',
        shopNow: 'Shop Now',
        itemShip: 'This item cannot be shipped to',
        noLovesDesc: 'Use your Loves list to keep track of your favorite products.',
        noLovesMyListDesc: 'Sign in to organize and share your saved products.',
        myLists: 'My Lists',
        getTheseBeforeTheyAreGone: 'Get These Before They’re Gone',
        onSaleNow: 'On Sale Now',
        lookingForFavBrands: 'Looking for your Favorite Brands?',
        goToBeautyPrefs: 'Go to Beauty Preferences',
        item: 'item',
        items: 'items',
        recentlyAdded: 'Recently Added',
        noLovesAdded: 'You haven’t saved anything to your Lists. Tap the heart next to products you‘re eyeing and choose a List to add them to.',
        browse: 'Browse Products',
        recentLists: 'Recent Lists',
        savedIn: 'Saved in',
        and: 'and'
    };
    return resources[label];
}
