export default function getResource(label, vars = []) {
    const resources = {
        notSure: 'Je ne sais pas',
        noPreference: 'Aucune préférence'
    };
    return resources[label];
}
