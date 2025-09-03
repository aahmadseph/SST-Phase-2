const resources = {
    getTheseBeforeGone: 'Procurez-vous-les avant qu’ils ne partent',
    items: 'Items',
    item: 'Item'
};

export default function getResource(label) {
    return resources[label];
}
