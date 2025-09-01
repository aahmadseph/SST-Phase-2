export default function getResource(label, vars = []) {
    const resources = { privateProfile: 'Ce profil est privé' };
    return resources[label];
}
