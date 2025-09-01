export default function getResource(label) {
    const resources = {
        scoreBasedPriority: 'Priorité basée sur le score',
        noRuleFound: 'Aucune règle trouvée pour ce bandeau.',
        noRuleSets: 'Aucun ensemble de règles configuré pour ce bandeau.',
        noBannerData: 'Aucune donnée sur le bandeau renvoyée pour les variations.',
        noRuleData: 'Aucune donnée renvoyée pour cette règle.',
        noBannerDataForVariation: 'Aucune donnée sur le bandeau configurée pour cette variation.'
    };

    return resources[label];
}
