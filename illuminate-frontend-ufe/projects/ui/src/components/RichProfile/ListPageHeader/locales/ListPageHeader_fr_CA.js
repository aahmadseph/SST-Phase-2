
export default function getResource(label, vars = []) {
    const resources = {
        backToLists: 'Retourner aux listes',
        lookingForFavBrands: 'Vous cherchez vos marques préférées?',
        goToBeautyPrefs: 'Aller aux préférences beauté'
    };
    return resources[label];
}
