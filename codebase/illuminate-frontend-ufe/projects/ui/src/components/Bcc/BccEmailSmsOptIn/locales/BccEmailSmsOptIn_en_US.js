export default function getResource(label, vars = []) {
    const resources = {
        emailAddresLabel: 'Email Address',
        phoneNumber: 'US Phone Number',
        signUp: 'Sign up',
        phoneInputErrorMsg: 'Please enter a phone number in the format of XXX-XXX-XXXX',
        successMsg: 'Thanks! You’re now signed up',
        successMsgEmail: ' for emails.',
        successMsgPhone: ' for text alerts.',
        errorMsg: 'Please correct the error(s) in the highlighted fields above. '
    };
    return resources[label];
}
