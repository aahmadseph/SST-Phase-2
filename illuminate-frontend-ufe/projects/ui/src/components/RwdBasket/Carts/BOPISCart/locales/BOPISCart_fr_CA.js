export default function getResource(label, vars = []) {
    const resources = {
        bopisTitle: `Achetez en ligne et ramassez en magasin (${vars[0]})`,
        changeMethod: 'Changer la méthode'

    };

    return resources[label];
}
