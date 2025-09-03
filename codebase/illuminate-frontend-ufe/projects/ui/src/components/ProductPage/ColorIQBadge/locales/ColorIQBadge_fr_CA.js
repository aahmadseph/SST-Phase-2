export default function getResource(label) {
    const resources = {
        your: 'Votre ',
        colorIQMatch: 'correspondance Color iQ.',
        colorIQ: 'Voir votre correspondance Color iQ'
    };
    return resources[label];
}
