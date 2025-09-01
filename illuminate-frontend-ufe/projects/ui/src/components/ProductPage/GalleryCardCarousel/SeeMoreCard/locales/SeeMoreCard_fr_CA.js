export default function getResource(label, vars = []) {
    const resources = {
        seeMore: 'Voir plus',
        inTheGallery: 'dans la galerie'
    };
    return resources[label];
}
