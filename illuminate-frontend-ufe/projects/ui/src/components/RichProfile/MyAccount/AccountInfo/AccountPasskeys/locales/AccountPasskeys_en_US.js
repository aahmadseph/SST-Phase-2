export default function getResource(label, vars = []) {
    const resources = {
        cancel: 'Cancel',
        createdOn: 'created on',
        edit: 'Edit',
        orDevicePassword: 'or device password.',
        passkey: 'Passkey',
        remove: 'Remove',
        signInWithFaceFingerprintPin: 'Sign in with face, fingerprint, PIN,',
        signInWithFaceOrFingerprint: 'Sign in with face or fingerprint.',
        sephoraAppText: '(Sephora App)',
        noPasskey: 'No passkeys available.'
    };
    return resources[label];
}
