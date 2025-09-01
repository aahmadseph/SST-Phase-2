const {
    colors, fonts, fontSizes, fontWeights, lineHeights, radii, space, shadows, zIndices
} = require('./config');

function generateVars(obj, prefix) {
    let vars = '';
    Object.keys(obj).map(key => {
        let val = obj[key];

        if (typeof val === 'number') {
            val = `${val}px`;
        }

        return (vars += `--${prefix}-${key}: ${val};`);
    });

    return vars;
}

const globalStyles = `
    :root {
        ${generateVars(colors, 'color')}
        ${generateVars(fonts, 'font-family')}
        ${generateVars(fontSizes, 'font-size')}
        ${generateVars(fontWeights, 'font-weight')}
        ${generateVars(lineHeights, 'leading')}
        ${generateVars(radii, 'rounded')}
        ${generateVars(space, 'space')}
        ${generateVars(shadows, 'shadow')}
        ${generateVars(zIndices, 'layer')}
    }
    input::-webkit-inner-spin-button,
    input::-webkit-outer-spin-button,
    input::-webkit-search-cancel-button,
    input::-webkit-search-decoration,
    input::-webkit-search-results-button,
    input::-webkit-search-results-decoration {
        display: none;
    }
    button::-moz-focus-inner,
    input::-moz-focus-inner {
        border-style: none;
        padding: 0;
    }
    *, ::after, ::before {
        box-sizing: border-box;
        border-width: 0;
        border-style: solid;
        border-color: currentColor;
    }
    * {
        margin: 0;
        padding: 0;
        background-color: transparent;
        color: inherit;
        font: inherit;
        text-transform: inherit;
        letter-spacing: inherit;
        text-align: inherit;
        text-decoration: none;
        align-items: normal;
        min-width: 0;
    }
    ol, ul {
        list-style: none;
    }
    [role="button"],
    button {
        cursor: pointer;
        border-radius: 0;
    }
    [role="button"][disabled],
    button[disabled] {
        cursor: default;
    }
    b, strong {
        font-weight: 700;
    }
    i, em {
        font-style: italic;
    }
    del {
        text-decoration: line-through;
    }
    u, ins {
        text-decoration: underline;
    }
    sub, sup {
        font-size: 75%;
        line-height: 0;
        position: relative;
        vertical-align: baseline;
    },
    sub {
        bottom: -.25em;
    }
    sup {
        top: -.5em;
    }
    .hideDefaults .isDefault {
        opacity: 0;
    }
    [data-sephid] {
        display: contents;
    }
    img:-moz-loading {
        visibility: hidden;
    }
    html {
        scrollbar-color: ${colors.black} ${colors.white};
        scrollbar-width: thin;
    }
    :not(html, body, .touch *)::-webkit-scrollbar {
        width: 6px;
        height: 6px;
        background-color: ${colors.lightGray};
        border-radius: 3px;
    }
    :not(html, body, .touch *)::-webkit-scrollbar-thumb {
        min-height: 6px;
        background-color: ${colors.black};
        border-radius: 3px;
        background-clip: content-box;
    }
    body {
        font-family: var(--font-family-base);
        font-size: var(--font-size-base);
        line-height: var(--leading-base);
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: var(--color-base);
        background-color: var(--color-white);
        display: flex;
        flex-direction: column;
    }
`;

export default globalStyles;
