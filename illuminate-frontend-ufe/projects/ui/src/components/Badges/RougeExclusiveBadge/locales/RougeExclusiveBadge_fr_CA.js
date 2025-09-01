export default function getResource(label, vars = []) {
    const resources = {
        rougeExclusive: 'EXCLUSIVITÉ ROUGE'
    };

    return resources[label];
}
