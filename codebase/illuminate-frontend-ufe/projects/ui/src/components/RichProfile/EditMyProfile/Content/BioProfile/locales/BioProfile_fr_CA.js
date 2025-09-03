export default function getResource(label, vars = []) {
    const resources = {
        uploadBgImage: 'Téléverser l’image de fond',
        uploadProfileImage: 'Téléverser l’image de profil',
        biography: 'Présentation',
        addShortBio: 'Ajouter une brève présentation',
        instagram: 'Instagram',
        instagramLink: 'Lien Instagram',
        youtube: 'YouTube',
        youtubeLink: 'Lien Youtube'
    };
    return resources[label];
}
