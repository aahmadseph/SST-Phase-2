const resources = {
    serverErrorMessage: 'Oups! Un problème est survenu.',
    serverErrorAction: 'Cliquez ci-dessus pour trouver votre teinte de nouveau.',
    apiErrorMessage: 'Nous n’avons pas trouvé de résultats…',
    apiErrorAction: 'Veuillez cliquer ci-dessus pour trouver votre teinte de nouveau.',
    welcome: 'Découvrez notre explorateur de teinte',
    clickAbove: 'Cliquez ci-dessus pour trouver le fond de teint qui vous convient le mieux.'
};

export default function getResource(label) {
    return resources[label];
}
