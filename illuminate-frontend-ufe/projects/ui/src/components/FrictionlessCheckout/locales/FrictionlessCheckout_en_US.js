const resources = {
    bopisTitle: 'Buy Online and Pick Up Checkout',
    sadTitle: 'Shipping and Delivery Checkout'
};

export default function getResource(label) {
    return resources[label];
}
