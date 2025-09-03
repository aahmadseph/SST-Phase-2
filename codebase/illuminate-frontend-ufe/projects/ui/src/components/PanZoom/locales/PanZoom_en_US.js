export default function getResource(label, vars = []) {
    const resources = {
        pinchAndZoom: 'Pinch and zoom',
        pinchToZoom: 'Pinch to zoom'
    };

    return resources[label];
}
