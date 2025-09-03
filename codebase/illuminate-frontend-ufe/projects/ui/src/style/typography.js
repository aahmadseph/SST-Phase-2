import {
    colors, fontSizes, mediaQueries, fontWeights
} from './config';
import { hexToRGB } from './util';

const typography = {
    '& :where(h1, h2, h3, h4, h5, h6)': {
        marginTop: '1em',
        marginBottom: '.5em',
        lineHeight: 'var(--leading-tight)',
        fontWeight: 'var(--font-weight-bold)'
    },
    '& :where(h1)': {
        fontSize: `${fontSizes.lg / fontSizes.base}rem`,
        [mediaQueries.sm]: {
            fontSize: `${fontSizes['xl'] / fontSizes.base}rem`
        }
    },
    '& :where(h2)': {
        fontSize: `${fontSizes.md / fontSizes.base}rem`,
        [mediaQueries.sm]: {
            fontSize: `${fontSizes.lg / fontSizes.base}rem`
        }
    },
    '& :where(h3)': {
        fontSize: `${fontSizes.md / fontSizes.base}rem`,
        [mediaQueries.sm]: {
            fontSize: `${fontSizes.lg / fontSizes.base}rem`
        }
    },
    '& :where(h4)': {
        fontSize: '1rem'
    },
    '& :where(h5)': {
        fontSize: `${fontSizes.sm / fontSizes.base}rem`,
        fontWeight: fontWeights.normal
    },
    '& :where(h6)': {
        fontSize: `${fontSizes.xs / fontSizes.base}rem`,
        fontWeight: fontWeights.normal
    },
    '& :where(p, ul, ol)': {
        marginBottom: '1em'
    },
    '& :where(hr)': {
        marginTop: '1em',
        marginBottom: '1em',
        color: colors.divider,
        border: 0,
        borderBottomWidth: 1,
        borderBottomStyle: 'solid'
    },
    '& :where(ul, ol)': { paddingLeft: '2em' },
    '& :where(ul)': { listStyle: 'disc' },
    '& :where(ol)': { listStyle: 'decimal' },
    // in RTE list items contain paragraphs so removing their margin
    '& :where(li > p:only-child, li > span > p:only-child)': {
        marginBottom: 0
    },
    '& :where(a, .Markdown-link)': {
        '--color': hexToRGB(colors.link, true),
        color: 'rgba(var(--color), 1)',
        textDecoration: 'underline',
        textDecorationColor: 'rgba(var(--color), .3)',
        transition: 'text-decoration-color .2s',
        '.no-touch &:hover': {
            textDecorationColor: 'rgba(var(--color), 1)'
        }
    }
};

export default typography;
