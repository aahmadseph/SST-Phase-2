export default function getResource(label, vars = []) {
    const resources = {
        curbsidePickupAvailable: 'Curbside Pickup Available'
    };

    return resources[label];
}
