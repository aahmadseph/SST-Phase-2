export default function getResource(label, vars = []) {
    const resources = {
        signUp: 'Sign me up for texts from Sephora',
        mobile: 'Mobile Phone Number',
        continueBtn: 'Continue',
        emptyError: 'Please enter a mobile phone number.',
        invalidError: 'Please enter a valid mobile phone number.'
    };

    return resources[label];
}
