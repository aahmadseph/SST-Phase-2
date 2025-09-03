export default function getResource(label, vars = []) {
    const resources = {
        share: 'Share',
        copied: 'Copied',
        copy: 'Copy'
    };
    return resources[label];
}
