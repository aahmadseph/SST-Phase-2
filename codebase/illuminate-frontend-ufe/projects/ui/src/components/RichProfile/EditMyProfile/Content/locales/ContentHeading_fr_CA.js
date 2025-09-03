export default function getResource(label, vars = []) {
    const resources = { infoPublicProfile: 'Ces informations ne sont pas publiées sur votre profil public' };
    return resources[label];
}
