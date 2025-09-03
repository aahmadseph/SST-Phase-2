const resources = {
    thanksMessage: 'Merci pour vos commentaires!',
    submit: 'Soumettre',
    close: 'proche'
};

export default function getResource(label) {
    return resources[label];
}
