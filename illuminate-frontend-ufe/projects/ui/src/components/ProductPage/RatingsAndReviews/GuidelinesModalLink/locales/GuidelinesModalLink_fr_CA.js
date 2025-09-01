export default function getResource(label) {
    const resources = {
        ratingsAndReviewsGuidelines: 'Consulter les lignes directrices concernant les notes et évaluations',
        done: 'Terminé'
    };
    return resources[label];
}
