export default function getResource(label, vars = []) {
    const resources = {
        gallery: 'gallery'
    };

    return resources[label];
}
