const resources = {
    employeeFeedback: 'Employés : Vous éprouvez des problèmes? Faites-les-nous savoir ▸',
    evergreen: 'Des commentaires sur le site Web? Faites-les-nous savoir ▸'
};

export default function getResource(label) {
    return resources[label];
}
