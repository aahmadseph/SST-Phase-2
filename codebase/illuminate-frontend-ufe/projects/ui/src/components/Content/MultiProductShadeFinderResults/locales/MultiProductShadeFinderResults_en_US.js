const resources = {
    serverErrorMessage: 'Uh oh, something went wrong.',
    serverErrorAction: 'Click above to find your shade again.',
    apiErrorMessage: 'Looks like we couldn’t find any results…',
    apiErrorAction: 'Please click above to find your shade again.',
    welcome: 'Welcome To Shader Finder',
    clickAbove: 'Click above to find your matching foundation.'
};

export default function getResource(label) {
    return resources[label];
}
