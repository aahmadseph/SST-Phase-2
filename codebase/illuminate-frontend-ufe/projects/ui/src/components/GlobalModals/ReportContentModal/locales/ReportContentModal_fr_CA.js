const resources = {
    reportTitle: 'Signaler une photo ou une vidéo',
    subTitle1: 'Si vous souhaitez signaler ce contenu comme inapproprié, veuillez copier le lien ci-dessous et l’envoyer par courriel à',
    subTitle2: 'avec la raison du signalement (expliquez brièvement pourquoi vous croyez que ce contenu enfreint les directives ou les conditions de la communauté)',
    copied: 'Copié',
    copy: 'Copier'
};

export default function getResource(label) {
    return resources[label];
}
