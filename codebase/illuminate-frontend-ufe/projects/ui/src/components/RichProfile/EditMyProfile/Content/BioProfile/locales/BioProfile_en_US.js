export default function getResource(label, vars = []) {
    const resources = {
        uploadBgImage: 'Upload background image',
        uploadProfileImage: 'Upload profile image',
        biography: 'Biography',
        addShortBio: 'Add a short bio',
        instagram: 'Instagram',
        instagramLink: 'Instagram Link',
        youtube: 'YouTube',
        youtubeLink: 'Youtube Link'
    };
    return resources[label];
}
