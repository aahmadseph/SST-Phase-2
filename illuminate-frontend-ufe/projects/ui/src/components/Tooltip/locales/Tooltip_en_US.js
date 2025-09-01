const resources = {
    gotIt: 'Got It'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
