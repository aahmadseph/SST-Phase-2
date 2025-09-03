export default function getResource(label, vars = []) {
    const resources = {
        addCreditOrDebitCard: 'Ajouter une carte de débit ou de crédit',
        addNewCreditOrDebitCard: 'Ajouter une nouvelle carte de crédit ou de débit',
        editCreditOrDebitCard: 'Modifier la carte de crédit ou de débit'
    };

    return resources[label];
}
