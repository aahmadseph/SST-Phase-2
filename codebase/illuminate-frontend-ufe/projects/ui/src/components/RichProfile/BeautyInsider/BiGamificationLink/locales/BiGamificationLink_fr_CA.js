const resources = {
    new: 'NOUVEAUTÉ',
    beautyChallenges: 'Défis Beauty Insider : Accumulez des points en accomplissant des tâches'
};

export default function getResource(label) {
    return resources[label];
}
