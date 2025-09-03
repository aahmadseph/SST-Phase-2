export default function getResource(label) {
    const resources = {
        contactMessage1: 'Please have your ',
        confirmEmail: 'confirmation email ',
        or: 'or ',
        photoId: 'photo ID ',
        ready: 'ready when you pick up your order.'
    };

    return resources[label];
}
