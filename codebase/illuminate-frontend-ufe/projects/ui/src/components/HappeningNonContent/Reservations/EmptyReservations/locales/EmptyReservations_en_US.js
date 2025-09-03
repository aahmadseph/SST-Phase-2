export default function getResource(label, vars = []) {
    const resources = {
        title: 'No reservations yet? Let’s change that!',
        description: 'Explore our Services and Events to discover a wide array of offerings in-store nearby. Book your first service today and be sure not to miss our upcoming events!',
        button: 'Explore Services and Events'
    };

    return resources[label];
}
