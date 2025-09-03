export default function getResource(label) {
    const resources = {
        removePhoto: 'Retirer la photo',
        addPhoto: 'Ajouter une photo',
        somethingWentWrongError: 'Une erreur s’est produite lors de votre chargement. Votre fichier doit comporter une extension .jpg, .png, .heic, .tiff ou .gif et ne pas dépasser 5 Mo.'
    };
    return resources[label];
}
