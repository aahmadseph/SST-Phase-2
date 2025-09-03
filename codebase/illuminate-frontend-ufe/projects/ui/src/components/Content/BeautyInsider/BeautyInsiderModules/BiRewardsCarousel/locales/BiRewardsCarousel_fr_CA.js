export default function getResource(label, vars = []) {
    const resources = {
        title: 'De la foire aux récompenses Rewards Bazaar®',
        titleRouge: 'Encore plus de récompenses',
        viewAll: 'Tout afficher',
        add: 'Ajouter',
        rougeBadge: 'ROUGE',
        omniRewardsNotice: 'Vous pouvez ajouter des articles Rewards Bazaar® avec les commandes de livraison le jour même ou de ramassage en magasin à partir du panier. *Selon la disponibilité'
    };
    return resources[label];
}
