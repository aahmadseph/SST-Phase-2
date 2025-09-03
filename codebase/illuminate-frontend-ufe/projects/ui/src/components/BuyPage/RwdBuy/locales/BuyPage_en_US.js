export default function getResource(label) {
    const resources = {
        relatedOnText: 'Related on Sephora.com:',
        prefferedProducts: 'Sephora customers often prefer the following products when searching for',
        productsRelated: 'Products related to'
    };

    return resources[label];
}
