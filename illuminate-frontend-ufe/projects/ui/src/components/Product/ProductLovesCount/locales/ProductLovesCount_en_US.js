export default function getResource(label, vars = []) {
    const resources = {
        love: ' love',
        loves: ' loves'
    };

    return resources[label];
}
