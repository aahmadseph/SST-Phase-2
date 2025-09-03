const resources = {
    shopByCategory: 'Magasiner par catégorie',
    shop: 'Magasiner'
};

export default function getResource(label) {
    return resources[label];
}
