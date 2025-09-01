export default function getResource(label, vars = []) {
    const resources = {
        ends: `ends ${vars[0]}`,
        seeMore: 'See more',
        copy: 'Copy',
        copied: 'Copied'
    };

    return resources[label];
}
