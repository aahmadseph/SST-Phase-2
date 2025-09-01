const resources = {
    getTheseBeforeGone: 'Get These Before They’re Gone',
    items: 'Items',
    item: 'Item'

};

export default function getResource(label) {
    return resources[label];
}
