export default function getResource(label) {
    const resources = {
        free: 'Free',
        freeForSDU: 'FREE for Same-Day Unlimited Subscribers',
        ok: 'OK',
        errorTitle: 'Error'
    };

    return resources[label];
}
