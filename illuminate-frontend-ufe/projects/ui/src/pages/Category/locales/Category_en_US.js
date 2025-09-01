export default function getResource(label, vars = []) {
    const resources = {
        justArrived: 'Just Arrived',
        bestsellers: 'Bestsellers'
    };

    return resources[label];
}
