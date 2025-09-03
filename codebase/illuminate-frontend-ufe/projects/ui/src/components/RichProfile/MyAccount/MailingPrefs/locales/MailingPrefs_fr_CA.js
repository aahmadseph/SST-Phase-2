export default function getResource(label, vars = []) {
    const resources = { emailAndMailPreferences: 'Courriel et préférences' };
    return resources[label];
}
