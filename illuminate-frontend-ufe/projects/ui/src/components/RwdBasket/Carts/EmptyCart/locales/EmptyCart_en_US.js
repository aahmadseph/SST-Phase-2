export default function getResource(label, vars = []) {
    const resources = {
        emptyBasketMessage: 'Your basket is currently empty.',
        shopNewArrivals: 'Shop New Arrivals',
        pleaseSignIn: 'Please sign in if you are trying to retrieve a previously created basket.',
        signInText: 'Sign In'
    };

    return resources[label];
}
