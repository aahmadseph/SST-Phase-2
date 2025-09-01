export default function getResource(label) {
    const resources = { sorrySomethingWrong: 'Nous sommes désolés, une erreur s’est produite. Veuillez essayer de nouveau.' };
    return resources[label];
}
