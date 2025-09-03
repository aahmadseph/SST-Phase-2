export default function getResource(label, vars = []) {
    const resources = {
        birthday: 'Birthday',
        changeBirthDate: 'If you need to change your birth date,',
        pleaseCall: 'please call Sephora at'
    };
    return resources[label];
}
