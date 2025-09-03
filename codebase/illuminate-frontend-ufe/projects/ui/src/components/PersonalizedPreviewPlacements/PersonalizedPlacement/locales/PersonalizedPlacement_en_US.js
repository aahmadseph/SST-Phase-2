export default function getResource(label) {
    const resources = {
        scoreBasedPriority: 'Score Based Prioritization',
        noRuleFound: 'No rule found for this banner.',
        noRuleSets: 'No rule sets configured for this banner.',
        noBannerData: 'No Banner data returned for the variations.',
        noRuleData: 'No rule Data returned for this rule.',
        noBannerDataForVariation: 'No Banner data configured for this variation.'
    };

    return resources[label];
}
