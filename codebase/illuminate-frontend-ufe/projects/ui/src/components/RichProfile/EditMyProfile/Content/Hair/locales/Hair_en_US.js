export default function getResource(label, vars = []) {
    const resources = {
        hairColor: 'Hair color',
        hairType: 'Hair type',
        hairConcerns: 'Hair concerns',
        selectOne: 'select one',
        selectAllType: 'select all that apply'
    };

    return resources[label];
}
