export default function getResource(label) {
    const resources = {
        shop: 'Shop',
        myStore: 'My Store'
    };

    return resources[label];
}
