export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Privacy Preference',
        save: 'Save Preferences',
        allowCookies: 'Allow advertising & analytics cookies',
        disallowCookies: 'Do not allow advertising & analytics cookies'
    };

    return resources[label];
}
