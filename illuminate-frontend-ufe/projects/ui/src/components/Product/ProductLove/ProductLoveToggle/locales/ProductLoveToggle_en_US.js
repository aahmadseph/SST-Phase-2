export default function getResource (label, vars = []) {
    const resources = {
        signInAriaLabel: `Sign in to love ${vars[0]}`,
        unloveLabel: 'Unlove',
        loveLabel: 'Love'
    };
    return resources[label];
}
