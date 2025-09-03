export default function getResource(label, vars = []) {
    const resources = {
        title: 'Il semblerait que vous n’ayez pas ouvert de session.',
        description: 'Veuillez ouvrir une session pour voir vos réservations.',
        button: 'Ouvrir une session'
    };
    return resources[label];
}
