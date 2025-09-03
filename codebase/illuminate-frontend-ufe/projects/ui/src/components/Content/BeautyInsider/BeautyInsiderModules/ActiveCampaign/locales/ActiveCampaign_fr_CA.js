export default function getResource(label, vars = []) {
    const resources = {
        ends: `prend fin le ${vars[0]}`,
        seeMore: 'Voir plus',
        copy: 'Copier',
        copied: 'Copié'
    };

    return resources[label];
}
