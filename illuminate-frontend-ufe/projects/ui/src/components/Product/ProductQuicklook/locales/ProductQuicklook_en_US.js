export default function getResource(label, vars = []) {
    const resources = {
        quickLookText: 'Quicklook',
        moreInfoText: `More info on ${vars[0]}`
    };

    return resources[label];
}
