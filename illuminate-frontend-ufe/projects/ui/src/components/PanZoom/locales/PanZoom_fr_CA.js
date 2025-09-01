export default function getResource(label, vars = []) {
    const resources = {
        pinchAndZoom: 'Pincer et agrandir',
        pinchToZoom: 'Pincer pour agrandir'
    };

    return resources[label];
}
