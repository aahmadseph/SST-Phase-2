export default function getResource(label) {
    const resources = {
        cvcInfoTitle: 'Credit Card Verification Code',
        visaCardCustomers: 'Visa/MC/Discover Card Customers',
        yourSecurityCodeMsg:
            'Your Security Code/CID (Card Identification Number) is located in the signature area on the back of your credit card. (It’s the 3 digits that appear AFTER the credit card account number). Visa/MC/Discover customer CIDs are 3 digits.',
        backOfCard: 'Back of Visa/MC/Discover Card',
        amexCustomers: 'American Express Customers',
        yourCodeAmexMsg:
            'Your Security Code/CID (Card Identification Number) is a 4-digit number on the front of the card, ABOVE the embossed (raised) credit card account number. This number is referred to as the “Security Code.” American Express customer CIDs are 4 digits.',
        frontOfAmexCard: 'Front of American Express Card',
        visaCardAltText: 'Back of Visa credit card showing the 3-digit security code location',
        amexCardAltText: 'Front of American Express credit card showing the 4-digit security code location'
    };

    return resources[label];
}
