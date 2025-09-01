export default function getResource(label, vars = []) {
    const resources = {
        anonymousHeading: 'Please sign in to access Your Sephora Beauty Win.',
        anonymousText: 'Your personal offer’s waiting for you.',
        anonymousButtonText: 'Sign In',
        expiredHeading: 'Offer no longer available',
        expiredText: 'Your Sephora Beauty Win has expired—but we have lots of other great offers going on.',
        exploreNowButton: 'Explore Now',
        unqualifiedHeading: 'Sorry, you’re not eligible for this offer',
        unqualifiedText: 'You don’t qualify for Your Sephora Beauty Win at this time, but we have lots of other great offers going on—check them out.',
        apiFailedHeading: 'Sorry, the page you’re looking for cannot be found.',
        apiFailedText: 'Try searching or go to our home page to continue shopping.',
        apiFailedButton: 'Go to Sephora Home Page'
    };

    return resources[label];
}
