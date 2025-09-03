export default function getResource(label, vars = []) {
    const resources = {
        title: 'Save to Your Beauty Preferences?',
        save: 'Save',
        cancel: 'Cancel',
        saved: 'Saved'
    };

    return resources[label];
}
