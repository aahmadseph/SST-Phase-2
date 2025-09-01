export default function getResource(label, vars = []) {
    const resources = {
        collections: 'Collections',
        posts: 'Publications',
        item: `${vars[0]} article(s)`,
        items: `${vars[0]} articles`,
        numberOfItems: `${vars[0]} de ${vars[1]} ${vars[2]}`,
        showMoreItems: `Afficher plus de ${vars[0]}`
    };

    return resources[label];
}
