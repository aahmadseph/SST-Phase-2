export default function getResource(label, vars = []) {
    const resources = {
        remove: 'Remove',
        cancel: 'Cancel',
        edit: 'Edit',
        cvc: 'CVV/CVC',
        moreInfoCvc: 'More info about CVV',
        expiredCreditCardMsg: 'This card is expired. Please update your card information.',
        cvcInfoTitle: 'Credit Card Verification Code',
        visaCardCustomers: 'Visa/MC/Discover Card Customers',
        yourSecurityCodeMsg:
            'Your Security Code/CID (Card Identification Number) is located in the signature area on the back of your credit card. (It’s the 3 digits that appear AFTER the credit card account number). Visa/MC/Discover customer CIDs are 3 digits.',
        backOfCard: 'Back of Visa/MC/Discover Card',
        amexCustomers: 'American Express Customers',
        yourCodeAmexMsg:
            'Your Security Code/CID (Card Identification Number) is a 4-digit number on the front of the card, ABOVE the embossed (raised) credit card account number. This number is referred to as the “Security Code.” American Express customer CIDs are 4 digits.',
        frontOfAmexCard: 'Front of American Express Card',
        addNewCreditCard: 'Add new credit or debit card',
        showMoreCards: 'Show more cards',
        showLessCards: 'Show less cards',
        giftCardsNotCombinableText: `Gift cards are not combinable with ${vars[0]}. If you want to use a gift card, please select another payment method.`,
        payWithCreditOrDebitCard: 'Pay with credit or debit card',
        visaOrMastercard: 'Visa and Mastercard debit cards only',
        editPaypal: 'Edit',
        paypalRestrictedItemError:
            'You have an item in Basket that cannot be purchased using PayPal. Please remove the item to continue checking out with PayPal or use a different payment method to continue checking out with the item.',
        removeAddress: 'Remove address',
        maxCreditCardsMessage: `You can have up to ${vars[0]} credit cards. Please delete one and try to add again.`,
        continueButton: 'Continue',
        removeCreditCard: 'Remove credit card or debit card',
        areYouSureMessage: 'Are you sure you would like to permanently remove this card?',
        debitCardDisclaimer: 'Visa and Mastercard debit cards only',
        setAsDefaultPayment: 'Set as default payment',
        setAsDefaultPaymentNotice: 'Set as default is only saved after checkout is completed.',
        gotIt: 'Got It'
    };

    return resources[label];
}
