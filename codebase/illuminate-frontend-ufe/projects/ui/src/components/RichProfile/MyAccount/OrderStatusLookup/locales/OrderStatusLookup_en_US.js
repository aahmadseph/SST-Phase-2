const resources = {
    titleLabel: 'Look up your order',
    orderNumberInputLabel: 'Order Number',
    emailInputLabel: 'Email Address',
    submitButtonLabel: 'Find my Order',
    signInText1: 'If you have an account,',
    signInText2: 'to view your order history.',
    signInLinkText: 'sign in'
};

export default function getResource(label) {
    return resources[label];
}
