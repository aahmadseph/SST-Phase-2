export default function getResource(label) {
    const resources = {
        errorMessage: 'Trouble connecting to Paze. Please use a different payment method or try again later.',
        legalNotice: 'By clicking Continue to Paze, I am instructing Sephora to send my order and billing information to Paze and understand that information will be subject to the ',
        pazeTerms: 'Paze terms',
        legalNotice02: ' and the ',
        pazePolicy: 'Paze privacy policy'
    };

    return resources[label];
}
