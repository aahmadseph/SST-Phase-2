export default function getResource(label, vars = []) {
    const resources = { tlp: `Pssst! ${vars[0]} - here’s a secret offer you won’t want to miss.` };
    return resources[label];
}
