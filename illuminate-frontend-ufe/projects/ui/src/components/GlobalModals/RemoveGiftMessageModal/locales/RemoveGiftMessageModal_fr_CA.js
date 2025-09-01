export default function getResource(label, vars = []) {
    const resources = {
        cancel: 'Annuler',
        errorMessage: 'Une erreur s’est produite, veuillez réessayer.',
        gotIt: 'Compris',
        remove: 'Retirer',
        title: 'Supprimer le message de cadeau',
        warningMessage: 'Êtes-vous sûr(e) de vouloir supprimer votre message cadeau?'
    };

    return resources[label];
}
