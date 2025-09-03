export default function getResource(label, vars = []) {
    const resources = {
        saveText: 'Enregistrer',
        savedText: 'Sauvegardé'
    };
    return resources[label];
}
