export default function getResource(label, vars = []) {
    const resources = {
        yourBirthday: 'Your birthday',
        callSephora: 'If you need to change your birth date, please call Sephora at '
    };
    return resources[label];
}
