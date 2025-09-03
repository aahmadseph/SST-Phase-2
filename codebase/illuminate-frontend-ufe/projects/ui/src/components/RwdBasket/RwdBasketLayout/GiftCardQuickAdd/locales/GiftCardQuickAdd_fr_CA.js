export default function getResource(label, vars = []) {
    const resources = {
        add: 'Ajouter',
        addMessage: 'Ajouter une carte-cadeau Sephora',
        addSubMessage: 'Le cadeau simple et idéal dont tout le monde rêve',
        selectGiftCardAmount: 'Montant de la carte-cadeau'
    };

    return resources[label];
}
