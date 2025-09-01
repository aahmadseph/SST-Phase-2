const resources = {
    ctaApply: 'Appliquer',
    ctaApplied: 'Appliqué',
    ctaRemove: 'Retirer',
    ctaUrl: 'Magasiner',
    ctaAppOnly: 'Exclusivité sur l’application',
    ctaStoreOnly: 'En magasin seulement',
    seeDetails: 'Voir les détails',
    insider: 'Réservé aux membres Beauty Insider.',
    vib: 'Rouge et VIB seulement.',
    rouge: 'Réservé aux membres Rouge.',
    ends: 'Fin',
    appOnly: 'Application seulement',
    onlineOnly: 'En ligne seulement',
    storeOnly: 'En magasin seulement',
    inStoreOrOnline: 'En magasin et en ligne',
    daysLeft: 'Jours restants',
    dayLeft: 'Jour restant',
    lastDay: 'Dernier jour',
    viewAll: 'Tout afficher'
};

export default function getResource(label) {
    return resources[label];
}
