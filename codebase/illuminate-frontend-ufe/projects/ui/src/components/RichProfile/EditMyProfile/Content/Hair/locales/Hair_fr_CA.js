export default function getResource(label, vars = []) {
    const resources = {
        hairColor: 'Colorant capillaire',
        hairType: 'Type de cheveux',
        hairConcerns: 'Problèmes de cheveux',
        selectOne: 'sélectionner une option',
        selectAllType: 'sélectionnez toutes les choix qui s’appliquent'
    };

    return resources[label];
}
