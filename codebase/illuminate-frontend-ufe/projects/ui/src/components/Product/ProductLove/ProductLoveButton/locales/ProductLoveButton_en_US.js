export default function getResource(label, vars = []) {
    const resources = {
        allText: ' All',
        unLoveText: 'Unlove',
        lovedText: 'Loved',
        addAllText: `Add${vars[0]} to Loves`,
        addToLists: `Add${vars[0]} to Lists`
    };

    return resources[label];
}
