export default function getResource(label, vars = []) {
    const resources = {
        address: 'Adresse',
        setAsDefaultAddress: 'Définir en tant qu’adresse par défaut',
        removeAddress: 'Supprimer l’adresse',
        cancel: 'Annuler',
        update: 'Mise à jour',
        save: 'Enregistrer',
        edit: 'Modifier',
        add: 'Ajouter',
        title: 'Supprimer l’adresse',
        message: 'Êtes-vous sûr de vouloir supprimer votre adresse de façon définitive?',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non'
    };
    return resources[label];
}
