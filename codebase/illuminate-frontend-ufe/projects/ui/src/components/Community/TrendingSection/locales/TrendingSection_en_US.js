const resources = {
    trending: 'Trending',
    uploadPhotoOrVideo1: 'Upload your photo or video',
    uploadPhotoOrVideo2: 'to Sephora Beauty Insider Community or mention @sephora on social media for a chance to be featured.'
};

export default function getResource(label) {
    return resources[label];
}
