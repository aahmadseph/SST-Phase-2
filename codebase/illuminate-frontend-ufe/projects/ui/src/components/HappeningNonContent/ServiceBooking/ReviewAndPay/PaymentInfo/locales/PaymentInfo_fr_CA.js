export default function getResource(label, vars = []) {
    const resources = {
        removeCreditCard: 'Supprimer une carte',
        maxCreditCardsMessage: `Vous pouvez avoir jusqu’à ${vars[0]} cartes de crédit. Veuillez en supprimer une et en ajouter une autre à nouveau.`,
        continue: 'Continuer'
    };

    return resources[label];
}
