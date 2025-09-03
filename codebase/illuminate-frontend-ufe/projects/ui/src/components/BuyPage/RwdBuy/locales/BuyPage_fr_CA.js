export default function getResource(label) {
    const resources = {
        relatedOnText: 'Connexe sur Sephora.com :',
        prefferedProducts: 'Les clients Sephora préfèrent souvent les produits suivants lorsqu’ils recherchent',
        productsRelated: 'Produits liés à'
    };

    return resources[label];
}
