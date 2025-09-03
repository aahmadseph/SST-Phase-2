const resources = {
    pros: 'Pros Mentioned',
    cons: 'Cons Mentioned'
};

export default function getResource(label) {
    return resources[label];
}
