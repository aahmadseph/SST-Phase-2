export default function getResource(label, vars = []) {
    const resources = { selectCurrent: 'Select your current shade for' };

    return resources[label];
}
