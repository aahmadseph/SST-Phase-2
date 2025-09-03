export default function getResource(label, vars = []) {
    const resources = {
        // category type link titles
        skinTypeLink: 'Shop Products for Your Skin Type',
        skinConcernsLink: 'Shop Products for Your Skin Concerns',
        fragrancePreferencesLink: 'Shop Your Preferred Fragrances',
        hairDescribleLink: 'Shop Products for Your Hair Type',
        hairTextureLink: 'Shop Products for Your Hair Texture',
        hairConcernsLink: 'Shop Products for Your Hair Concerns',
        shoppingPreferencesDesc: 'Shop Your Preferred Products in:',
        favoriteBrandsDesc: 'Shop Your Favorite Brands in:',
        ingredientPreferencesDesc: 'Shop Your Preferred Ingredients in:',
        colorIQLink: 'Shop Matching Foundation Products',
        makeupLink: 'Makeup',
        skincareLink: 'Skincare',
        hairLink: 'Hair',
        fragranceLink: 'Fragrance'
    };
    return resources[label];
}
