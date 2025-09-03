const resources = {
    iq: 'IQ',
    sale: 'SOLDE',
    new: 'NOUVEAUTÉ',
    match: 'CORRESPONDANCE',
    exact: 'EXACT',
    shadeFinder: 'Trouver votre teinte',
    instructionPrefix: 'La sélection d’un format peut automatiquement actualiser les photos de produits affichées pour mieux correspondre à la sélection de',
    color: 'couleur',
    size: 'Format',
    view: 'Afficher',
    less: 'voir moins ',
    all: 'tous les produits ',
    more: 'voir plus ',
    onlyAFewLeft: 'plus que quelques articles en stock',
    closest: 'la plus proche',
    close: 'proche',
    DEFAULT: 'Par défaut',
    GRID: 'Grille',
    LIST: 'Liste',
    selected: 'Sélectionné'
};

export default function getResource(label) {
    return resources[label];
}
