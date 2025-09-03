export default function getResource(label, vars = []) {
    const resources = {
        birthday: 'Date de naissance',
        changeBirthDate: 'Pour changer votre date de naissance,',
        pleaseCall: 'veuillez appelez Sephora au'
    };
    return resources[label];
}
