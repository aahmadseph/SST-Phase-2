export default function getResource(label) {
    const resources = {
        useMyLocation: 'Use my location',
        useMyLocationText: 'By using this feature, you agree to share your information with Google and are subject to Google’s ',
        privacyPolicy: 'Privacy Policy',
        nevermind: 'Nevermind',
        continue: 'Continue'
    };

    return resources[label];
}
