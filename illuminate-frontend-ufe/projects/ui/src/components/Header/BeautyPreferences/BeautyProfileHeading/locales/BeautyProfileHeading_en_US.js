export default function getResource(label, vars = []) {
    const resources = {
        selectOne: 'Select one',
        selectAllThatApply: 'Select all that apply',
        skinType: 'Skin Type',
        skinConcerns: 'Skin Concerns',
        skinTone: 'Skin Tone',
        hairDescrible: 'Hair Type',
        hairTexture: 'Hair Texture',
        hairConcerns: 'Hair Concerns',
        hairConcernsBenefits: 'Hair Concerns and Benefits',
        hairColor: 'Hair Color',
        eyeColor: 'Eye Color',
        ageRange: 'Age Range',
        fragrancePreferences: 'Fragrance Preferences',
        shoppingPreferences: 'Shopping Preferences',
        ingredientPreferences: 'Ingredient Preferences',
        favoriteBrands: 'Favorite Brands',
        colorIQ: 'Color IQ',
        ofText: 'of'
    };
    return resources[label];
}
