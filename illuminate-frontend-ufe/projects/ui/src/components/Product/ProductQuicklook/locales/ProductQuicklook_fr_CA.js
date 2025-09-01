export default function getResource(label, vars = []) {
    const resources = {
        quickLookText: 'Aperçu rapide',
        moreInfoText: `Pour en savoir plus sur ${vars[0]}`
    };

    return resources[label];
}
