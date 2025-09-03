export default function getResource(label, vars = []) {
    const resources = { relatedContentLabel: 'Contenu relié :' };
    return resources[label];
}
