export default function getResource(label, vars = []) {
    const resources = {
        bopisKohlsItem: 'Quantity is limited to 1 per item at Kohl’s locations'
    };

    return resources[label];
}
