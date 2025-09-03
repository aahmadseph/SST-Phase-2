export default function getResource(label, vars = []) {
    const resources = {
        colorIQMatches: 'Your Color iQ Matches',
        save: 'Save'
    };

    return resources[label];
}
