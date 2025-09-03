const resources = {
    trending: 'Tendance',
    uploadPhotoOrVideo1: 'Téléversez votre photo ou votre vidéo',
    uploadPhotoOrVideo2: 'à la communauté Sephora Beauty Insider ou mentionnez @sephora sur les médias sociaux pour courir la chance d’être en vedette.'
};

export default function getResource(label) {
    return resources[label];
}
