export default function getResource(label, vars = []) {
    const resources = {
        curbsidePickupAvailable: 'Ramassage à l’extérieur offert'
    };

    return resources[label];
}
