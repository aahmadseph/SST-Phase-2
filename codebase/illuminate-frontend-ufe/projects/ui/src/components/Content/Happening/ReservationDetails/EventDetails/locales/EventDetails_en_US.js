export default function getResource(label) {
    const resources = {
        event: 'Event',
        free: 'FREE',
        location: 'Location',
        getDirections: 'Get directions',
        confirmationNumber: 'Confirmation #'
    };

    return resources[label];
}
