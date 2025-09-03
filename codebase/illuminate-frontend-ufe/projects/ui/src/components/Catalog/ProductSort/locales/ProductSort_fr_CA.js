const resources = {
    sortBy: 'Trier par',
    sortDescribedBy: 'À la sélection de l’option de filtre, les produits affichés seront automatiquement mis à jour pour correspondre à l’option de filtre choisie.'
};

export default function getResource(label) {
    return resources[label];
}
