export default function getResource(label, vars = []) {
    const resources = {
        modalTitle: 'Préférences de confidentialité',
        save: 'Enregistrer les préférences',
        allowCookies: 'Autoriser les témoins publicitaires et analytiques',
        disallowCookies: 'Ne pas autoriser les témoins publicitaires et analytiques'
    };

    return resources[label];
}
