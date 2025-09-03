export default function getResource(label, vars = []) {
    const resources = {
        beautyInsiderCommunity: 'Collectivité Beauty Insider',
        beautyInsiderDescription: 'Des personnes réelles. Des conversations réelles. En temps réel. Trouvez l’inspiration pour vous faire belle, osez des questions et bénéficiez de conseils avisés de membres Beauty Insider qui vous ressemblent. Vous êtes prêt?',
        startNow: 'Commencer maintenant',
        exploreThecommunity: 'Explorer la Collectivité'
    };
    return resources[label];
}
