const resources = {
    shareOrDelete: 'Partager ou supprimer',
    share: 'Partager',
    delete: 'Supprimer',
    shareOrReport: 'Partager ou signaler',
    report: 'Rapport',
    shareSubTitle: 'Copier le lien suivant pour partager.',
    cancel: 'Annuler',
    deleteTitle: 'Supprimer une photo ou une vidéo',
    deleteSubTitle: 'Êtes-vous sûr(e) de vouloir supprimer cette photo ou ce vidéo? Une fois votre photo supprimée, tous les détails qui y sont associés seront supprimés de façon permanente.',
    deleteConfirmation: 'Votre photo ou votre vidéo a été supprimée avec succès. Veuillez patienter une heure avant que la photo ne soit supprimée.',
    done: 'Terminé'
};

export default function getResource(label) {
    return resources[label];
}
