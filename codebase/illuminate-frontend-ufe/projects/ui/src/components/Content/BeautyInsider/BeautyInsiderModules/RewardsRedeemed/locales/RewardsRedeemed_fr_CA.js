export default function getResource(label, vars = []) {
    const resources = {
        itemIsNoLongerAvailable: 'Cet article n’est plus disponible',
        viewFullSize: 'Voir en format standard',
        shopTheBrand: 'Découvrir la marque',
        viewDetails: 'Voir les détails',
        itemShipToCanada: 'Cet article ne peut pas être expédié au Canada',
        itemShipToUS: 'Cet article ne peut pas être expédié aux États-Unis',
        finalSaleItem: 'Vente finale : Aucun retour ni échange',
        redeemedOn: `Réclamé le ${vars[0]}`,
        noRewardsYet: 'Vos récompenses réclamées s’afficheront ici.',
        browseLinkText: 'Voir Rewards Bazaar',
        rewardsActivity: 'Récompenses réclamées',
        viewAll: 'Tout afficher'
    };
    return resources[label];
}
