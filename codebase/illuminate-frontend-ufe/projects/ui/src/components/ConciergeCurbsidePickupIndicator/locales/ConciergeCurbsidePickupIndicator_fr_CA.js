export default function getResource(label, vars = []) {
    const resources = {
        conciergeCurbsidePickupAvailable: 'Concierge disponible pour ramassage à l’extérieur'
    };

    return resources[label];
}
