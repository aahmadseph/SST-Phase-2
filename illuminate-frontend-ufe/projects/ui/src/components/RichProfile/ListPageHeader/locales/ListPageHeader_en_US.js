
export default function getResource(label, vars = []) {
    const resources = {
        backToLists: 'Back to Lists',
        lookingForFavBrands: 'Looking for your Favorite Brands?',
        goToBeautyPrefs: 'Go to Beauty Preferences'
    };
    return resources[label];
}
