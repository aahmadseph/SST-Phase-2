import { system } from 'styled-system';

const grid = system({
    gap: {
        property: 'gap',
        scale: 'space'
    },
    columnGap: {
        property: 'columnGap',
        scale: 'space'
    },
    rowGap: {
        property: 'rowGap',
        scale: 'space'
    },
    gridColumn: true,
    gridRow: true,
    gridAutoFlow: true,
    gridAutoColumns: true,
    gridAutoRows: true,
    gridTemplateColumns: true,
    gridTemplateRows: true,
    gridTemplateAreas: true,
    gridArea: true
});

export default grid;
