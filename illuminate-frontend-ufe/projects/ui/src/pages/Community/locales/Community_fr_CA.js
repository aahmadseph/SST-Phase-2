export default function getResource(label, vars = []) {
    const resources = {
        gallery: 'Galerie'
    };

    return resources[label];
}
