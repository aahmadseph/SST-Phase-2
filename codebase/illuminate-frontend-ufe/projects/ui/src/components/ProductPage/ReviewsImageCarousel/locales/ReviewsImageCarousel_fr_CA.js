export default function getResource(label, vars = []) {
    const resources = {
        title: 'Images des commentaires',
        showReview: 'Afficher le commentaire'
    };
    return resources[label];
}
