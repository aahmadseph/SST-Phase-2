export default function getResource(label, vars = []) {
    const resources = {
        basketLovesListTitle: 'Your Loves list is waiting for you!',
        basketLovesListSignInCTA: 'Sign in and discover a new way to collect your favorite beauty products and organize all your online and in-store purchases.',
        emptyLovesTitle: 'You haven’t loved anything yet!',
        emptyLovesText: 'Collect all your favorite beauty and must-try products by clicking on the',
        whileYouShopText: 'while you shop.',
        viewLovesText: 'View Loves',
        yourLovesText: 'Your Loves',
        signInText: 'Sign In'
    };

    return resources[label];
}
