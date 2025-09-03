export default function getResource(label, vars = []) {
    const resources = {
        found: 'We found your',
        color: 'Color:',
        sorry: 'Sorry, we weren’t able to find a match for you.',
        reviewShades: 'Continue to review available shades for',
        selectShade: 'Select this shade',
        done: 'Done',
        closest: 'closest match',
        exact: 'exact match',
        seeAllProducts: 'See all products in this shade',
        foundMultiShade: 'We found your shade',
        products: 'products',
        serverErrorMessage: 'Uh oh, something went wrong.',
        serverErrorAction: 'Click above to find your shade again.',
        apiErrorMessage: 'Looks like we couldn’t find any results…',
        apiErrorAction: 'Please click above to find your shade again.',
        queryParamsErrorMessage: 'Welcome to Shade Finder',
        queryParamsErrorAction: 'Click above to find your matching foundation.'
    };

    return resources[label];
}
