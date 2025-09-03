export default function getResource(label, vars = []) {
    const resources = {
        unfollow: 'Unfollow',
        follow: 'Follow',
        sendMessage: 'Send Message'
    };
    return resources[label];
}
