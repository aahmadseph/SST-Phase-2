export default function getResource(label, vars = []) {
    const resources = {
        checkoutWith: 'Passer à la caisse avec'
    };

    return resources[label];
}
