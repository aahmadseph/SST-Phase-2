export default function getResource(label, vars = []) {
    const resources = {
        add: 'Add',
        addMessage: 'Add a Sephora Gift Card',
        addSubMessage: 'The super-easy gift on everyone\'s list',
        selectGiftCardAmount: 'Gift card amount'
    };

    return resources[label];
}
