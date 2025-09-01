export default function getResource(label, vars = []) {
    const resources = { privateProfile: 'This profile is private' };
    return resources[label];
}
