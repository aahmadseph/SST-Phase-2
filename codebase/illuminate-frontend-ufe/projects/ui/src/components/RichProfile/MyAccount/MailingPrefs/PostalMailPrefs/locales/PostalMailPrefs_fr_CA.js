export default function getResource(label, vars = []) {
    const resources = {
        postalMail: 'Adresse postale',
        status: 'Statut :',
        subscribed: 'Inscrit',
        notSubscribed: 'Non inscrit',
        subscribe: 'S’abonner',
        unsubscribe: 'Se désabonner',
        cancel: 'Annuler',
        save: 'Enregistrer',
        outsideMail: 'Sephora n’envoie pas de courrier postal en dehors des États-Unis et au Canada.',
        edit: 'Modifier'
    };
    return resources[label];
}
