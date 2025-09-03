export default function getResource(label, vars = []) {
    const resources = { tlp: `Psst! ${vars[0]} - voici une offre secrète dont vous voudrez profiter.` };
    return resources[label];
}
