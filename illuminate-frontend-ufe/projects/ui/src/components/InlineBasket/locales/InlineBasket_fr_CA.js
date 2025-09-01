export default function getResource(label, vars = []) {
    const resources = {
        goToBasket: 'Ouvrir le panier',
        item: 'article',
        items: 'articles'
    };
    return resources[label];
}
