export default function getResource(label, vars = []) {
    const resources = { seeDetails: 'See Details' };
    return resources[label];
}
