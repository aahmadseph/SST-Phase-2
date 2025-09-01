export default function getResource(label, vars = []) {
    const resources = {
        submit: 'submit',
        joinBI: 'Join Beauty Insider',
        tellUsText: 'Tell us about yourself—fill out your Beauty Traits to receive personalized product recommendations.',
        finishYourProfile: 'Finish your profile'
    };

    return resources[label];
}
