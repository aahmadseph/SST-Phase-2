const resources = {
    title: 'AI Beauty Chat',
    placeholder: 'Message...',
    shareFeedback: 'Share Feedback',
    new: 'NEW',
    addToBasket: 'Add to Basket',
    size: 'Size',
    errorMessage: 'Something went wrong. Please try restarting the chat or',
    resendYourMessage: 'resend your message',
    lookingForAGift: 'I am looking for a gift!'
};

export default function getResource(label) {
    return resources[label];
}
