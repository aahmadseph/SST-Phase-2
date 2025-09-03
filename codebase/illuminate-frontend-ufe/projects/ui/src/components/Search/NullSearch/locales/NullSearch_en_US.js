const resources = {
    moreWaysToShop: 'More Ways to Shop',
    shopByCategory: 'Shop by Category',
    new: 'New',
    bestsellers: 'Bestsellers',
    valueGiftSets: 'Value & Gift Sets',
    brands: 'Brands',
    sephoraCollection: 'Sephora Collection',
    miniSize: 'Mini Size',
    valueSize: 'Value Size',
    makeup: 'Makeup',
    skincare: 'Skincare',
    hair: 'Hair',
    toolsBrushes: 'Tools & Brushes',
    fragrance: 'Fragrance',
    bathBody: 'Bath & Body',
    gifts: 'Gifts',
    sale: 'Sale'
};

export default function getResource(label) {
    return resources[label];
}
