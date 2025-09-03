const resources = {
    iq: 'IQ',
    sale: 'SALE',
    new: 'NEW',
    match: 'MATCH',
    exact: 'EXACT',
    shadeFinder: 'Find your shade',
    instructionPrefix: 'Choosing a color may automatically update the product photos that are displayed to match the selected',
    color: 'color',
    size: 'Size',
    view: 'View',
    less: 'less ',
    all: 'all ',
    more: 'more ',
    onlyAFewLeft: 'only a few left',
    closest: 'closest',
    close: 'close',
    DEFAULT: 'Default',
    GRID: 'Grid',
    LIST: 'List',
    selected: 'Selected'
};

export default function getResource(label) {
    return resources[label];
}
