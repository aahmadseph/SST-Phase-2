export default function getResource(label, vars = []) {
    const resources = {
        addCreditOrDebitCard: 'Add a Debit or Credit Card',
        addNewCreditOrDebitCard: 'Add a New Credit or Debit Card',
        editCreditOrDebitCard: 'Edit Credit or Debit Card'
    };

    return resources[label];
}
