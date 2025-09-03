const resources = {
    getDirections: 'Get Directions',
    callStore: 'Call Store',
    makeMyStore: 'Make My Selected Store',
    yourSelectedStore: 'Your Selected Store'
};

export default function getResource(label) {
    return resources[label];
}
