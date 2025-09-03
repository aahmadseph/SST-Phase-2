
export default function getResource(label, vars = []) {
    const resources = {
        beautyPreferencesTitle: 'Préférences beauté',
        beautyPreferencesHeaderDescription: 'Dites-nous vos traits beauté et vos préférences de magasinage pour obtenir des recommandations personnalisées.'
    };
    return resources[label];
}
