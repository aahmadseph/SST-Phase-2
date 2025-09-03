export default function getResource(label, vars = []) {
    const resources = { liveChat: 'Live Chat' };

    return resources[label];
}
