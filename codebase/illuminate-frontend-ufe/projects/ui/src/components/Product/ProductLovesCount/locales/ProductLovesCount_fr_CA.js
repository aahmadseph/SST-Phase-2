export default function getResource(label, vars = []) {
    const resources = {
        love: ' j’aime',
        loves: ' coups de cœur'
    };

    return resources[label];
}
