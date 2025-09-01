export default function getResource(label, vars = []) {
    const resources = {
        notifications: 'Notifications',
        reminders: 'Rappels',
        personalizedRecommendations: 'Nous vous enverrons des recommandations spéciales et d’autres courriels en fonction des catégories dans lesquelles vous effectuez le plus d’achats.',
        sampleEmail: 'Voir le modèle de courriel',
        status: 'Statut :',
        subscribed: 'Inscrit',
        notSubscribed: 'Non inscrit',
        subscribe: 'S’abonner',
        unsubscribe: 'Se désabonner',
        cancel: 'Annuler',
        save: 'Enregistrer',
        edit: 'Modifier'
    };
    return resources[label];
}
