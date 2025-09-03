export default function getResource(label, vars = []) {
    const resources = {
        sectionTitle: 'Politiques relatives aux réservations'
    };

    return resources[label];
}
