export default function getResource(label, vars = []) {
    const resources = {
        selectOne: 'Sélectionner une option',
        selectAllThatApply: 'Sélectionner toutes les options qui s’appliquent',
        skinType: 'Type de peau',
        skinConcerns: 'Préoccupations cutanées',
        skinTone: 'Ton de peau',
        hairDescrible: 'Type de cheveux',
        hairTexture: 'Texture des cheveux',
        hairConcerns: 'Préoccupations liées aux cheveux',
        hairConcernsBenefits: 'Préoccupations et bienfaits cheveux',
        hairColor: 'Couleur des cheveux',
        eyeColor: 'Couleur des yeux',
        ageRange: 'Tranche d’âge',
        fragrancePreferences: 'Préférences parfums',
        shoppingPreferences: 'Préférences magasinage',
        ingredientPreferences: 'Préférences ingrédients',
        favoriteBrands: 'Marques favorites',
        colorIQ: 'Couleur Qi',
        ofText: 'de'
    };
    return resources[label];
}
