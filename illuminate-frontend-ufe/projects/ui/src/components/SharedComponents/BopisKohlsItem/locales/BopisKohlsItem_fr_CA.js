export default function getResource(label, vars = []) {
    const resources = {
        bopisKohlsItem: 'La quantité est limitée à un par article aux emplacements Kohl’s'
    };

    return resources[label];
}
