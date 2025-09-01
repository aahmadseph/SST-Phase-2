export default function getResource(label, vars = []) {
    const resources = {
        sorry: 'Sorry! The page you’re looking for cannot be found.',
        try: 'Try searching or go to our home page to continue shopping.',
        home: 'Go to Sephora Home Page'
    };

    return resources[label];
}
