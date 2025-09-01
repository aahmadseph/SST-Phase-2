export default function getResource(label, vars = []) {
    const resources = {
        noLoves: 'You haven’t added any product to your Loves list.',
        collectAllYourFavorites: 'Collect all your favorite and must-try products by clicking on the',
        whileYouShop: 'while you shop.',
        youHaveToSignIn: 'You have to sign in to see this page.',
        signInToViewAllYourFav: 'Sign in to view all your favorite items in the Loves list.',
        signIn: 'Sign in',
        sharedLoves: 'Shared Loves',
        loves: 'Loves',
        share: 'Share',
        showMore: 'Show More',
        copyLinkAndShare: 'Copy the following link and share it with friends:',
        yourLoves: 'your loves',
        sortDescribedByText: 'Choosing sorting option will automatically update the products that are displayed to match the selected sorting option',
        getTheseBeforeTheyAreGone: 'Get These Before They’re Gone',
        recentlyLoved: 'Recently Loved'
    };
    return resources[label];
}
