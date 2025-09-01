export default function getResource(label, vars = []) {
    const resources = { liveChat: 'Clavardage en direct' };

    return resources[label];
}
