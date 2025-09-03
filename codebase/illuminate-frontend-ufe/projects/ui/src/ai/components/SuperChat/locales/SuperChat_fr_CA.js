const resources = {
    title: 'Clavardage beauté IA',
    placeholder: 'Message...',
    shareFeedback: 'Partagez vos commentaires',
    new: 'NOUVEAUTÉ',
    addToBasket: 'Ajouter au panier',
    size: 'Size',
    errorMessage: 'Something went wrong. Please try restarting the chat or',
    resendYourMessage: 'resend your message',
    lookingForAGift: 'I am looking for a gift!'
};

export default function getResource(label) {
    return resources[label];
}
