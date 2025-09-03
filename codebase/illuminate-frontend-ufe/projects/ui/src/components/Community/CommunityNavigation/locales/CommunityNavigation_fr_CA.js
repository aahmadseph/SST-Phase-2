export default function getResource(label, vars = []) {
    const resources = {
        community: 'Collectivité',
        profile: 'Profil',
        groups: 'Groupes',
        gallery: 'Galerie',
        communityNavigation: 'Navigation dans la collectivité',
        notificationsFeed: 'Flux de notifications',
        startAConversation: 'Commencer une conversation',
        messages: 'Messages',
        uploadToGallery: 'Téléverser dans la galerie'
    };
    return resources[label];
}
