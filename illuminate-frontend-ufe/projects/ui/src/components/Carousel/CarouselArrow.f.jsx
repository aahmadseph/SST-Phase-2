import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, radii } from 'style/config';
import constants from './constants';
import { Box } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

const getText = localeUtils.getLocaleResourceFile('components/Carousel/locales', 'Carousel');

const { ARROW_SIZE, VIEWBOX_WIDTH, VIEWBOX_HEIGHT } = constants;

function CarouselArrow({
    scrollPadding, direction, variant, bounds, disabled, showOnHover, width, arrowWidth, outdent, hasShadowsCover, ...props
}) {
    const isNext = direction === 'next';
    const arrowDirection = isNext ? 'right' : 'left';
    const size = width || ARROW_SIZE;
    const arrowSize = arrowWidth || '1em';

    return (
        <Box
            className='Carousel-control'
            disabled={disabled}
            aria-label={`${getText(isNext ? 'next' : 'previous')} ${getText('slide')}`}
            data-at={Sephora.debug.dataAt(`carousel_${direction}_btn`)}
            marginX={!hasShadowsCover && (scrollPadding || (variant === 'circle' && 2))}
            css={[
                styles.button,
                styles[direction],
                outdent && {
                    [arrowDirection]: -outdent,
                    marginLeft: 0,
                    marginRight: 0
                },
                styles[variant],
                {
                    width: size,
                    height: size
                },
                showOnHover && { opacity: 0 },
                hasShadowsCover && { opacity: 1 }
            ]}
            {...props}
        >
            <svg
                viewBox={`0 0 ${VIEWBOX_WIDTH} ${VIEWBOX_HEIGHT}`}
                css={[
                    styles.svg,
                    {
                        width: arrowSize
                    }
                ]}
            >
                <g
                    fillRule='nonzero'
                    fill='none'
                >
                    {variant === 'simple' && !disabled && (
                        <>
                            <path
                                css={styles.hover}
                                d='m5.551 0 .272.006a5.567 5.567 0 0 1 3.649 1.64l.194.203 12.951 14.543A5.404 5.404 0 0 1 24 19.999a5.388 5.388 0 0 1-1.204 3.396l-.17.2-12.96 14.556c-1.943 2.18-5.273 2.469-7.573.672a5.4 5.4 0 0 1-.876-7.683l.156-.183L11.131 20 1.369 9.038c-1.895-2.134-1.794-5.31.166-7.355l.178-.178.182-.167.202-.166A5.55 5.55 0 0 1 5.231.007L5.55 0ZM2.405 32.95l-.11.224a3.35 3.35 0 0 0-.22.67l-.034.184a3.375 3.375 0 0 0 .155 1.656l.05.133c.1.247.23.484.39.706l.058.077.134.167-.06-.071c.07.085.145.168.224.247l.122.117.05.045.156.129c1.415 1.106 3.456.979 4.714-.277l.142-.15 12.96-14.554.145-.174.118-.16.108-.166.058-.098.054-.101.055-.108.05-.112.04-.097.037-.1.04-.114.034-.116.03-.111.025-.113c.03-.15.052-.3.062-.454L22 20l-.008-.225a3.382 3.382 0 0 0-.713-1.86l-.147-.175L8.176 3.192l-.153-.159-.161-.148c-.22-.19-.46-.352-.713-.482l-.17-.083-.175-.073-.083-.03-.163-.053-.219-.06-.195-.04-.212-.03-.214-.018-.204-.004c-.706 0-1.404.208-1.998.61l-.194.141-.156.13-.147.136a3.377 3.377 0 0 0-.289 4.513l.13.155L13.817 20 2.863 32.3l-.131.156a3.432 3.432 0 0 0-.327.495Z'
                                fill={colors.midGray}
                            />
                            <path
                                d='M3.934 3.56a2.388 2.388 0 0 0-.924 1.677 2.365 2.365 0 0 0 .597 1.793L15.159 20 3.607 32.97a2.355 2.355 0 0 0-.598 1.791c.06.663.388 1.258.924 1.68.454.35 1.01.538 1.583.535a2.56 2.56 0 0 0 1.916-.84l12.959-14.553c.392-.44.609-1.002.609-1.583 0-.58-.217-1.144-.609-1.583L7.432 3.865a2.557 2.557 0 0 0-1.917-.841c-.559 0-1.12.175-1.581.536ZM5.16 34.85a.39.39 0 0 1-.159-.27.35.35 0 0 1 .096-.266L17.845 20 5.098 5.687a.354.354 0 0 1-.096-.267.383.383 0 0 1 .159-.27.575.575 0 0 1 .36-.119.559.559 0 0 1 .42.176l12.961 14.554c.064.07.099.154.099.239a.35.35 0 0 1-.098.236L5.941 34.793a.559.559 0 0 1-.42.177.589.589 0 0 1-.361-.12Z'
                                fill={colors.white}
                                fillOpacity='.6'
                            />
                        </>
                    )}
                    <path
                        d='M4.547 4.354c-.644.503-.731 1.399-.195 2.003L16.502 20 4.352 33.643c-.537.604-.45 1.497.195 2.002.644.503 1.602.422 2.14-.182L19.646 20.91c.237-.263.354-.587.354-.91 0-.323-.117-.648-.354-.913L6.687 4.536c-.3-.33-.724-.516-1.168-.512a1.58 1.58 0 0 0-.972.33Z'
                        fill='currentColor'
                    />
                </g>
            </svg>
        </Box>
    );
}

const styles = {
    svg: {
        height: `${VIEWBOX_HEIGHT / VIEWBOX_WIDTH}em`
    },
    button: {
        position: 'absolute',
        top: '50%',
        transform: 'translateY(-50%)',
        borderRadius: 2,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'opacity 300ms',
        ':focus': {
            opacity: 1
        },
        ':disabled': {
            pointerEvents: 'none'
        }
    },
    circle: {
        background: 'rgba(0,0,0,.7)',
        color: colors.white,
        fontSize: 18,
        borderRadius: radii.full,
        ':disabled': {
            opacity: '0 !important'
        }
    },
    simple: {
        fontSize: 22,
        ':disabled': {
            color: colors.midGray
        }
    },
    hover: {
        opacity: 0,
        transition: 'opacity .2s',
        '.no-touch button:hover &': {
            opacity: 1
        }
    },
    prev: {
        left: 0,
        '> svg': {
            transform: 'scaleX(-1)',
            marginLeft: -4
        }
    },
    next: {
        right: 0,
        '> svg': {
            marginRight: -4
        }
    }
};

CarouselArrow.propTypes = {
    direction: PropTypes.oneOf(['prev', 'next']).isRequired,
    variant: PropTypes.oneOf(['simple', 'circle']).isRequired,
    showOnHover: PropTypes.bool,
    offset: PropTypes.number,
    width: PropTypes.number
};

CarouselArrow.defaultProps = {
    showOnHover: false,
    width: ARROW_SIZE
};

export default wrapFunctionalComponent(CarouselArrow, 'CarouselArrow');
