export default function getResource(label, vars = []) {
    const resources = {
        saveText: 'Save',
        savedText: 'Saved'
    };
    return resources[label];
}
