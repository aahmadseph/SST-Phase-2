export default function getResource(label, vars = []) {
    const resources = { accountInfoTitle: 'Account Information' };
    return resources[label];
}
