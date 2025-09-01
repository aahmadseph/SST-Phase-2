export default function getResource(label, vars = []) {
    const resources = {
        previewSettings: 'Aperçu des paramètres',
        showAssets: 'Afficher les actifs',
        active: 'Actif',
        all: 'Tous',
        viewOnActualInventory: 'Afficher en fonction des stocks réels',
        viewAsInStock: 'Afficher les articles comme étant en stock (ignorer l’inventaire)',
        go: 'Rechercher',
        toggleKillswitches: 'Basculer les coupe-circuits',
        confirm: 'Confirmer',
        profileAttributes: 'Aperçu avec attributs du profil',
        selectionErrors: 'Il y a des erreurs dans vos sélections.'
    };
    return resources[label];
}
