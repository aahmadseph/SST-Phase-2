export default function getResource(label, vars = []) {
    const resources = {
        seeMore: 'See more',
        inTheGallery: 'in the Gallery'
    };
    return resources[label];
}
