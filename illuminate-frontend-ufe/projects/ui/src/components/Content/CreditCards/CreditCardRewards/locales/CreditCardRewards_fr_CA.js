const resources = {
    scanRewardsCard: 'Balayer les cartes de récompense en magasin'
};

export default function getResource(label) {
    return resources[label];
}
