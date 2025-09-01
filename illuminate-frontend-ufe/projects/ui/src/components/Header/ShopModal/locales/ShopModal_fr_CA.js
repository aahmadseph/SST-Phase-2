export default function getResource(label, vars = []) {
    const resources = {
        all: 'Tous',
        featured: 'Offres en vedette'
    };

    return resources[label];
}
