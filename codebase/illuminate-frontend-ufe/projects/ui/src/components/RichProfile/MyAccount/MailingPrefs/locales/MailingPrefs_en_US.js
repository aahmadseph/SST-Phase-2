export default function getResource(label, vars = []) {
    const resources = { emailAndMailPreferences: 'Email & Mail Preferences' };
    return resources[label];
}
