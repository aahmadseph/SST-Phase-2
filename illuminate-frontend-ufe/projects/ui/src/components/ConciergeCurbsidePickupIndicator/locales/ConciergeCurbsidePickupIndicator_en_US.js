export default function getResource(label, vars = []) {
    const resources = {
        conciergeCurbsidePickupAvailable: 'Curbside Concierge Available'
    };

    return resources[label];
}
