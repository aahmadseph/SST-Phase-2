export default function getResource(label, vars = []) {
    const resources = {
        error: 'Error',
        submissionError: 'Something went wrong while trying to process your submission. Please try again later.',
        ok: 'OK',
        phoneNumberRejected: 'Invalid phone type. Please check your entry or use a valid entry.'
    };

    return resources[label];
}
