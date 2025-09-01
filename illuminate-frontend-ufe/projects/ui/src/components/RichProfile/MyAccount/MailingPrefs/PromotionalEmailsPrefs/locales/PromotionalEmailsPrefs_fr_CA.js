const resources = {
    sendSpecialOffers: 'Nous vous enverrons des offres spéciales, les actualités des magasins et les nouveautés sur les dernières tendances de beauté.',
    sampleEmail: 'Voir le modèle de courriel',
    status: 'Statut :',
    subscribed: 'Inscrit',
    notSubscribed: 'Non inscrit',
    frequency: 'Fréquence :',
    country: 'Pays :',
    postalCode: 'Code postal :',
    promotional: 'Courriels',
    emails: 'Promotionnels',
    subscribe: 'S’abonner',
    unsubscribe: 'Se désabonner',
    allOffers: 'Toutes les offres',
    weekly: 'Chaque semaine',
    monthly: 'Chaque mois',
    enterZip: 'Saisissez votre code ZIP/postal afin d’en savoir plus sur les événements en magasin près de chez vous.',
    zipCode: 'Code postal',
    pleaseEnterZip: 'Veuillez saisir un code postal ou ZIP.',
    cancel: 'Annuler',
    save: 'Enregistrer',
    edit: 'Modifier'
};

export default function getResource(label) {
    return resources[label];
}
