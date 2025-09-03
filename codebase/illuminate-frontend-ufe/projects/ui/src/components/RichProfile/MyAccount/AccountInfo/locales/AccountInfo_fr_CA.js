export default function getResource(label, vars = []) {
    const resources = { accountInfoTitle: 'Renseignements sur le compte' };
    return resources[label];
}
