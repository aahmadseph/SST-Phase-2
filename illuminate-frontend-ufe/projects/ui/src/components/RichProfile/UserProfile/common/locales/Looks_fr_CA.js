export default function getResource(label, vars = []) {
    const resources = {
        featuredPhotos: 'Photos en vedette',
        photos: 'Photos',
        myPhotos: 'Mes photos',
        isFeaturedPhotos: 'Pour voir et se faire voir. Publiez et consultez des photos et des vidéos d’autres membres Beauty Insider.',
        hasntAddedPhotosVideos: `${vars[0]} n’a encore ajouté aucune photo ou vidéo.`,
        exploreAllPhotos: 'Explorer toutes les photos',
        addAPhoto: 'Ajouter une photo',
        userGeneratedImage: 'image générée par l’utilisateur',
        uploadToGallery: 'Téléverser dans la galerie'
    };
    return resources[label];
}
