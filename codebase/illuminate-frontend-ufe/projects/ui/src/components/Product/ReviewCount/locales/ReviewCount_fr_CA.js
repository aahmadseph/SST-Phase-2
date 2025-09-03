export default function getResource(label) {
    const resources = { review: 'évaluation', reviews: 'évaluations' };
    return resources[label];
}
