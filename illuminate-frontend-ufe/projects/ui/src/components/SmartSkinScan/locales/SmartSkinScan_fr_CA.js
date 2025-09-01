const resources = {
    getStarted: 'Démarrer',
    signInToGetStarted: 'Ouvrir une session pour commencer'
};

export default function getResource(label) {
    return resources[label];
}
