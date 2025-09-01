export default function getResource(label) {
    const resources = {
        useMyLocation: 'Utiliser ma position',
        useMyLocationText: 'En utilisant cette fonction, vous acceptez de partager vos informations avec Google et vous êtes assujetti à la ',
        privacyPolicy: 'politique de confidentialité',
        nevermind: 'Ce n’est pas grave',
        continue: 'Continuer'
    };

    return resources[label];
}
