export default function getResource(label, vars = []) {
    const resources = {
        frequentlyBoughtTogether: 'Frequently Bought Together',
        addAllToBasket: 'Add All to Basket',
        itemsAdded: '3 items added: ',
        totalPrice: `Total Price: ${vars[0]}`,
        frequentlyBoughtWithThisProduct: 'Frequently Bought With This Product'
    };

    return resources[label];
}
