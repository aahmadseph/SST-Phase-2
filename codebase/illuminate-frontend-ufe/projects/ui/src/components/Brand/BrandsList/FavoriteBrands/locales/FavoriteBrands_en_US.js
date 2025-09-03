export default function getResource(label, vars = []) {
    const resources = {
        favoriteBrands: 'Favorite Brands',
        saveYourFBsMessageOne: 'Save your Favorite Brands to your',
        beautyPreferences: 'Beauty Preferences',
        saveYourFBsMessageTwo: 'for a more personalized shopping experience.',
        favoriteBrandsAppearHere: 'Your favorite brands will appear here.',
        viewAllBautyPrefs: 'View all Beauty Preferences'
    };

    return resources[label];
}
