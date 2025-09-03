export default function getResource(label, vars = []) {
    const resources = {
        featuredPhotos: 'Featured Photos',
        photos: 'Photos',
        myPhotos: 'My Photos',
        isFeaturedPhotos: 'See and be seen. Post and browse photos and videos from other Beauty Insider members.',
        hasntAddedPhotosVideos: `${vars[0]} hasn’t added any photos or videos yet.`,
        exploreAllPhotos: 'Explore all photos',
        addAPhoto: 'Add a Photo',
        userGeneratedImage: 'user generated image',
        uploadToGallery: 'Upload to Gallery'
    };
    return resources[label];
}
