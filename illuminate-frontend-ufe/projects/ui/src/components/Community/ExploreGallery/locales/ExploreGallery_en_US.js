const resources = {
    searchTitle: 'Search photos & videos',
    explore: 'Explore',
    uploadToGallery: '+ Upload to Gallery',
    cancel: 'Cancel',
    resultsFor: ' results for ',
    clearAll: 'Clear all'
};

export default function getResource(label) {
    return resources[label];
}
