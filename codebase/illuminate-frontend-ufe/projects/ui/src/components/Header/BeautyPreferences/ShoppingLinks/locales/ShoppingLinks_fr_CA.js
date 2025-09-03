export default function getResource(label, vars = []) {
    const resources = {
        // category type link titles
        skinTypeLink: 'Découvrez des produits pour votre type de peau',
        skinConcernsLink: 'Découvrez des produits pour vos préoccupations en matière de peau',
        fragrancePreferencesLink: 'Découvrez vos parfums préférés',
        hairDescribleLink: 'Découvrez des produits pour votre type de cheveux',
        hairTextureLink: 'Découvrez des produits pour votre texture de cheveux',
        hairConcernsLink: 'Découvrez des produits pour vos préoccupations en matière de cheveux',
        shoppingPreferencesDesc: 'Magasinez vos essentiels préférés dans :',
        favoriteBrandsDesc: 'Magasinez vos marques préférées dans :',
        ingredientPreferencesDesc: 'Magasinez vos ingrédients préférés dans :',
        colorIQLink: 'Magasinez les correspondances de fond de teint',
        makeupLink: 'Maquillage',
        skincareLink: 'Soins pour la peau',
        hairLink: 'Cheveux',
        fragranceLink: 'Parfums'
    };
    return resources[label];
}
