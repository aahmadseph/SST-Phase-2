const resources = {
    moreWaysToShop: 'Autres manières de magasiner',
    shopByCategory: 'Magasiner par catégorie',
    new: 'Nouveauté',
    bestsellers: 'Favoris beauté',
    valueGiftSets: 'Coffrets et cadeaux',
    brands: 'Marques',
    sephoraCollection: 'Sephora Collection',
    miniSize: 'miniformats',
    valueSize: 'Format avantageux',
    makeup: 'Maquillage',
    skincare: 'Soins pour la peau',
    hair: 'Cheveux',
    toolsBrushes: 'Outils et pinceaux',
    fragrance: 'Parfums',
    bathBody: 'Bain et corps',
    gifts: 'Cadeaux',
    sale: 'Solde'
};

export default function getResource(label) {
    return resources[label];
}
