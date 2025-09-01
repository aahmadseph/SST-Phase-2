export default function getResource(label, vars = []) {
    const resources = {
        limitedSupply: 'Limited Supply',
        goingFast: 'Going Fast',
        signInToAccess: 'Sign in to access',
        addFullSize: 'Add Full Size',
        addToBasket: 'Add to Basket',
        addToBasketShort: 'Add',
        remove: 'Remove',
        writeAReview: 'Write A Review',
        free: 'FREE',
        birthday: 'birthday gift',
        priceInPoints: `${vars[0]} points`
    };

    return resources[label];
}
