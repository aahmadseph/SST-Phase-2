const resources = {
    showMore: 'Afficher plus',
    rougeBadge: 'ROUGE',
    signInToAccess: 'Ouvrir une session pour accéder au compte',
    viewAll: 'Voir tout'
};

export default function getResource(label) {
    return resources[label];
}
