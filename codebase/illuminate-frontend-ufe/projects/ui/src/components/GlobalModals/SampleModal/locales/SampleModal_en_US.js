export default function getResource(label, vars = []) {
    const resources = {
        selectUpToSamples: `Select up to ${vars[0]} sample(s)`,
        alterTitle: 'Select up to 2 free samples',
        done: 'Done'

    };

    return resources[label];
}
