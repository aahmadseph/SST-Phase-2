const resources = {
    placeholderUs: 'Inscrire code postal',
    placeholderCa: 'Inscrire code postal',
    placeholderOnline: 'Exclusivité en ligne',
    messageEmpty: 'Code postal ou Zip non valide.',
    messageInvalid: 'Code postal non valide.'
};

export default function getResource(label) {
    return resources[label];
}
