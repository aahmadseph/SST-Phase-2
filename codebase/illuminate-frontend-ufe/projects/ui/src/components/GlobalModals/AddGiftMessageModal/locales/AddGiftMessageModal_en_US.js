export default function getResource(label) {
    const resources = {
        title: 'Add a Gift Message',
        subTitleScreen1: 'Choose Your Design',
        subTitleScreen2: 'Write Your Message',
        subTitleScreen3: 'Preview Your Message',
        next: 'Next',
        back: 'Back',
        preview: 'Preview',
        recipientName: 'Recipient’s Name',
        yourName: 'Your Name',
        recipientEmailAddress: 'Recipient’s Email Address',
        giftMessage: 'Gift Message (Optional)',
        enterRecipientNameError: 'Please enter the gift recipient’s name.',
        enterYourNameError: 'Please enter your name.',
        invalidNameError: 'Invalid Name: Name must include only letters and be a maximum of 31 characters',
        enterRecipientEmailAddressError: 'Please enter the gift recipient’s email address.',
        invalidRecipientEmailAddressError: 'Please enter an e-mail address in the format of username@domain.com.',
        giftMessageTimingMsg: 'Your recipient will receive an email containing your gift message and an estimated delivery date when the order has shipped.',
        toText: 'To',
        fromText: 'From',
        save: 'Save',
        errorMessageRequest: 'Something went wrong, please try again'
    };

    return resources[label];
}
