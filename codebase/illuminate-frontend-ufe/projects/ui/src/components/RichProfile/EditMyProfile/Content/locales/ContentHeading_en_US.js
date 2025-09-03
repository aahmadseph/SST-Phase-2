export default function getResource(label, vars = []) {
    const resources = { infoPublicProfile: 'This info is not shown on your public profile' };
    return resources[label];
}
