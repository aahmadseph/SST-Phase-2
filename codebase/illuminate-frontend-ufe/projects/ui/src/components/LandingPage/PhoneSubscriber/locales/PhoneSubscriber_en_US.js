export default function getResource(label) {
    const resources = {
        buttonLabel: 'Sign Up Now',
        inputLabel: 'Mobile Phone Number',
        mobilePhoneEmptyError: 'Please enter a mobile phone number.',
        mobilePhoneInvalidError: 'Please enter a valid mobile phone number.',
        serverErrorMessage: 'Oops! We had an issue processing your request. Please try again.'
    };

    return resources[label];
}
