export default function getResource(label, vars = []) {
    const resources = {
        skinTone: 'Teint',
        skinType: 'Type de peau',
        selectOne: 'sélectionner une option',
        skincareConcerns: 'Problèmes de peau',
        selectAllApply: 'sélectionnez toutes les choix qui s’appliquent',
        ageRange: 'Tranche d’âge'
    };

    return resources[label];
}
