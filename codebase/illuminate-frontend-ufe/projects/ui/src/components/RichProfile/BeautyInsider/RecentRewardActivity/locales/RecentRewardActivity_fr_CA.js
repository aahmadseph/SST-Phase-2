export default function getResource(label, vars = []) {
    const resources = {
        rewardsActivity: 'Récompenses réclamées',
        viewAll: 'Tout afficher',
        noRewardsYet: 'Vos récompenses réclamées s’afficheront ici.',
        browseLinkText: 'Voir Rewards Bazaar'
    };

    return resources[label];
}
