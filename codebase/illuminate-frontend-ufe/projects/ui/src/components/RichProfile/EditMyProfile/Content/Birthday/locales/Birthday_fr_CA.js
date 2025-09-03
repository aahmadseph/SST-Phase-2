export default function getResource(label, vars = []) {
    const resources = {
        yourBirthday: 'Votre anniversaire',
        callSephora: 'Si vous voulez change votre date d’anniversaire, veuillez appeler Sephora au '
    };
    return resources[label];
}
