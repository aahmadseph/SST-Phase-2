export default function getResource(label, vars = []) {
    const resources = {
        member: 'Member',
        join: 'Join',
        new: `${vars[0]} new`
    };
    return resources[label];
}
