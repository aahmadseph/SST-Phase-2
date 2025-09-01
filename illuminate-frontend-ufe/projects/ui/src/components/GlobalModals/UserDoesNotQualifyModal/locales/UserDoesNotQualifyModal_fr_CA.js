const resources = {
    title: 'Erreur',
    confirmButton: 'OK',
    noQualify: 'Vous n’êtes pas admissible à cet article, conformément à nos',
    termsAndConditions: 'MODALITÉS'
};

export default function getResource(label, vars = []) {
    return resources[label];
}
