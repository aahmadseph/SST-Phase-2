/* eslint-disable quotes */
const resources = {
    gallery: 'Gallery',
    title: 'My Gallery',
    titleCTA: 'All Gallery',
    photosVideos: 'Photos & Videos',
    gridTitle: 'My Photos & Videos',
    gridTitleCTA: '+ Upload to gallery',
    myGalleryNoPhotosTitle: `You don't have any photos or videos yet.`,
    myGalleryNoPhotosText: 'Upload a photo or video to get started.',
    publicUserGalleryNoPhotosText: ` hasn't added any photos or videos yet..`,
    myGalleryNoPhotosCTA: 'Upload to Gallery',
    publicUserGalleryNoPhotosCTA: 'Back to Gallery',
    uploadedGalleryCount: 'Photos & Videos'
};

export default function getResource(label) {
    return resources[label];
}
