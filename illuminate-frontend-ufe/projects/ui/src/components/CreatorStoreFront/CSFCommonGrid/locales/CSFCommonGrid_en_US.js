export default function getResource(label, vars = []) {
    const resources = {
        collections: 'Collections',
        posts: 'Posts',
        item: `${vars[0]} item`,
        items: `${vars[0]} items`,
        numberOfItems: `${vars[0]} of ${vars[1]} ${vars[2]}`,
        showMoreItems: `Show More ${vars[0]}`
    };

    return resources[label];
}
