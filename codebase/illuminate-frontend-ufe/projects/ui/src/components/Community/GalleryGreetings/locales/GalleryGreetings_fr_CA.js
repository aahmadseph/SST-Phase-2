const resources = {
    title: 'Galerie',
    link: 'Ma galerie',
    boxTitle: 'Bonjour! C’est votre première fois ici?',
    boxDescription: 'Pour voir et se faire voir. Publiez et consultez des photos et des vidéos d’autres membres de la collectivité Beauty Insider.',
    boxLink: 'En savoir plus',
    boxCTA: 'Compris'
};

export default function getResource(label) {
    return resources[label];
}
