export default function getResource(label, vars = []) {
    const resources = {
        size: `FORMAT ${vars[0]}`,
        item: `ARTICLE ${vars[0]}`
    };
    return resources[label];
}
