const resources = {
    gotIt: 'Compris'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
