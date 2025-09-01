export default function getResource(label, vars = []) {
    const resources = {
        submissionError: 'Submission Error',
        thankYou: 'Thank You',
        somethingWentWrongError: 'An error occurred during the submission process, please retry at a later time.',
        reviewsPostMessage: 'Reviews are typically posted within 72 hours of the time you submit them, so stay tuned. Thank you for helping to make the Sephora community better!',
        continueShopping: 'Continue Shopping'
    };
    return resources[label];
}
