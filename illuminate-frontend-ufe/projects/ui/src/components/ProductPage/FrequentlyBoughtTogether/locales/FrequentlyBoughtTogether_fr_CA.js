export default function getResource(label, vars = []) {
    const resources = {
        frequentlyBoughtTogether: 'Souvent achetés ensemble',
        addAllToBasket: 'Tout ajouter au panier',
        itemsAdded: 'Trois articles ajoutés : ',
        totalPrice: `Prix total : ${vars[0]}`,
        frequentlyBoughtWithThisProduct: 'Souvent acheté avec ce produit'
    };

    return resources[label];
}
