export default function getResource(label, vars = []) {
    const resources = {
        skinTone: 'Skin tone',
        skinType: 'Skin type',
        selectOne: 'select one',
        skincareConcerns: 'Skincare concerns',
        selectAllApply: 'select all that apply',
        ageRange: 'Age Range'
    };

    return resources[label];
}
