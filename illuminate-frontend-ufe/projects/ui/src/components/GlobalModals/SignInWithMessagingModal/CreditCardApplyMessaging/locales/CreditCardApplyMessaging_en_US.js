export default function getResource(label, vars = []) {
    const resources = {
        dontHaveAccountMessage: 'Don’t have an account?',
        registerWithSephoraMessage: 'Register with Sephora.com to apply for the Sephora Credit Card  Program and join Beauty Insider, our free loyalty program.',
        registerApplyButton: 'Register and apply now'
    };

    return resources[label];
}
