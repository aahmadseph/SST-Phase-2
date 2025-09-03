export default function getResource(label, vars = []) {
    const resources = { seeAll: 'See all' };

    return resources[label];
}
