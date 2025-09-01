export default function getResource(label, vars = []) {
    const resources = {
        colorIQMatches: 'Vos correspondances Color iQ',
        save: 'Enregistrer'
    };

    return resources[label];
}
