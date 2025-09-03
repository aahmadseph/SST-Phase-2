export default function getResource(label, vars = []) {
    const resources = {
        favoriteBrands: 'Marques favorites',
        saveYourFBsMessageOne: 'Enregistrez vos marques préférées dans vos',
        beautyPreferences: 'Préférences beauté',
        saveYourFBsMessageTwo: 'pour une expérience de magasinage plus personnalisée.',
        favoriteBrandsAppearHere: 'Vos marques préférées apparaîtront ici.',
        viewAllBautyPrefs: 'Voir toutes les préférences beauté'
    };

    return resources[label];
}
