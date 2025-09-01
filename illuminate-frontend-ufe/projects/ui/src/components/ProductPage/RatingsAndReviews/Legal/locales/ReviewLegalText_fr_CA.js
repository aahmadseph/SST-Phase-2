export default function getResource(label) {
    const resources = {
        // Ratings & Reviews guidelines
        legalMessage: 'Les évaluations de produits sont gérées par un tiers pour en vérifier l’authenticité et la conformité à nos'
    };
    return resources[label];
}
