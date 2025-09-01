export default function getResource(label, vars = []) {
    const resources = {
        title: 'Récompenses Carte de crédit',
        moreLink: 'Voir plus',
        listTitle: 'Récompenses carte de crédit obtenues',
        creditCardReward: 'Récompense carte de crédit',
        view: 'Afficher',
        more: 'voir plus',
        modalButton: 'Compris'
    };

    return resources[label];
}
