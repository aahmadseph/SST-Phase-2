export default function getResource(label, vars = []) {
    const resources = {
        notSure: 'Not sure',
        noPreference: 'No Preference'
    };
    return resources[label];
}
