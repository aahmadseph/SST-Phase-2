export default function getResource(label, vars = []) {
    const resources = {
        welcomeTo: 'Bienvenue chez',
        beautyInsider: 'Beauty Insider',
        joinNow: 'S’inscrire'
    };

    return resources[label];
}
