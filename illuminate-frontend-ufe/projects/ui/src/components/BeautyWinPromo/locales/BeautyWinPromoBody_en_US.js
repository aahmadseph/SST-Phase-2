export default function getResource(label, vars = []) {
    const resources = {
        signInMessage: 'Please sign in to access Your Sephora Beauty Win.',
        signInMessageDescription: 'Your personal offer’s waiting for you.',
        signIn: 'Sign In',
        shopNow: 'Shop Now',
        exploreNow: 'Explore Now',
        useCode: `USE CODE ${vars[0]}`,
        validUntil: `Valid Until ${vars[0]}, ${vars[1]}`,
        oops: 'Oops',
        notAvailable: 'You don\'t qualify for Your Sephora Beauty Win at this time, but we have lots of other great offers going on—check them out.',
        isExpired: 'Your Sephora Beauty Win has expired—but we have lots of other great offers going on.',
        notFound: 'Sorry! The page you’re looking for cannot be found.',
        goHome: 'Try searching or go to our home page to continue shopping.',
        goHomeCTA: 'Go to sephora home page',
        wonderWhy: 'Wondering Why You Got This?'
    };
    return resources[label];
}
