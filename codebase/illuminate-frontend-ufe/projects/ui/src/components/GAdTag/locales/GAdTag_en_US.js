export default function getResource(label, vars = []) {
    const resources = { advertising: 'Advertising' };

    return resources[label];
}
