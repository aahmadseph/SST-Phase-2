export default function getResource(label, vars = []) {
    const resources = {
        endDescription: 'to your Beauty Preferences',
        edit: 'Edit',
        save: 'Save',
        and: 'and',
        saved: 'Saved',
        notNow: 'Not now'
    };
    return resources[label];
}
