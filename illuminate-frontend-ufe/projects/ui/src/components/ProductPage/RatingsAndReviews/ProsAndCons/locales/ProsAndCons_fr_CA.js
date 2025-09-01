const resources = {
    pros: 'Pour mentionnés',
    cons: 'Inconvénients mentionnés'
};

export default function getResource(label) {
    return resources[label];
}
