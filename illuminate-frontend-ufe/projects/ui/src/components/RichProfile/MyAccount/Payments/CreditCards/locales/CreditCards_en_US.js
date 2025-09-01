export default function getResource(label, vars = []) {
    const resources = {
        thisCardHasExpired: 'This card is expired. Please update your card information.',
        defaultCreditCard: 'Default card',
        makeDefaultCreditCard: 'Set as my default card',
        edit: 'Edit',
        addCreditCard: 'Add credit or debit card',
        cardDescText: `${vars[0]} ending in ${vars[1]}`,
        cardExpirationText: `Expires ${vars[0]} ${vars[1]}`,
        debitCardDisclaimer: 'Visa and Mastercard debit cards only',
        gotIt: 'Got It',
        accountUpdateModal: 'Account Update',
        defaultCardErrorModal: 'Unable to set this card as default at the moment. Please try again later.',
        deleteCardErrorModal: 'Unable to delete this card at the moment. Please try again later.',
        done: 'Done',
        ok: 'Okay'
    };
    return resources[label];
}
