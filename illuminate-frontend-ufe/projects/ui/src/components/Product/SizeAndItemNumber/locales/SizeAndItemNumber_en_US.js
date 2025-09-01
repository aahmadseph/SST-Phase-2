export default function getResource(label, vars = []) {
    const resources = {
        size: `SIZE ${vars[0]}`,
        item: `ITEM ${vars[0]}`
    };
    return resources[label];
}
