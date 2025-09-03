export default function getResource(label, vars = []) {
    const resources = {
        seeAllFoundations: 'Découvrir tous les fonds de teint',
        matchFound: 'Votre teinte correspondante.',
        noMatches: 'Désolés, aucune correspondance trouvée.'
    };
    return resources[label];
}
