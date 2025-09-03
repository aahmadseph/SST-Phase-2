export default function getResource(label, vars = []) {
    const resources = {
        community: 'Community',
        profile: 'Profile',
        groups: 'Groups',
        gallery: 'Gallery',
        communityNavigation: 'Community Navigation',
        notificationsFeed: 'Notifications Feed',
        startAConversation: 'Start a Conversation',
        messages: 'Messages',
        uploadToGallery: 'Upload to Gallery'
    };
    return resources[label];
}
