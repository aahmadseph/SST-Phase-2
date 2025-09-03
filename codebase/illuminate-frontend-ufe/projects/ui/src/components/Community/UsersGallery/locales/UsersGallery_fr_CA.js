/* eslint-disable quotes */
const resources = {
    gallery: 'Galerie',
    title: 'Ma galerie',
    titleCTA: 'Toutes les galeries',
    photosVideos: 'Photos et vidéos',
    gridTitle: 'Mes photos et vidéos',
    gridTitleCTA: '+ Téléverser dans la galerie',
    myGalleryNoPhotosTitle: `Vous n’avez pas encore de photos ou de vidéos.`,
    myGalleryNoPhotosText: 'Télécharger une photo ou une vidéo pour commencer.',
    publicUserGalleryNoPhotosText: ` n’a pas encore ajouté de photo ou de vidéo.`,
    myGalleryNoPhotosCTA: 'Téléverser dans la galerie',
    publicUserGalleryNoPhotosCTA: 'Retour à la galerie',
    uploadedGalleryCount: 'Photos et vidéos'
};

export default function getResource(label) {
    return resources[label];
}
