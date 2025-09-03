export default function getResource(label, vars = []) {
    const resources = {
        gotIt: 'Got It',
        howDoPasskeysWork: 'How do passkeys work?',
        howItWorks: 'How it works',
        passkeyDescription: 'Passkey is a simple, more secure alternative to passwords. Passkeys use your device lock (e.g. face, fingerprint, pin, or device password), instead of a Sephora account password, to more securely sign in.',
        sephoraNeverReceivesYourData: 'Sephora never receives your biometric data, like fingerprints or face scans, and your sign-in info stays secure on your device.',
        useFaceFingerprintPinOrDevicePassword: 'Use face, fingerprint, PIN, or device password to log in on compatible devices, currently only available on the iOS Sephora app',
        yourPasskeyIsUnique: 'Your passkey is unique and works only on the specific device and app or browsers where you set it up. No password is needed on recognized devices and apps or browsers.',
        whatIsAPasskey: 'What is a passkey?'
    };

    return resources[label];
}
