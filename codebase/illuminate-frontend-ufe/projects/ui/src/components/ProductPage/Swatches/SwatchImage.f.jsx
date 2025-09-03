import Flag from 'components/Flag/Flag';
import { Box } from 'components/ui';
import PropTypes from 'prop-types';
import React from 'react';
import { colors, radii } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import swatchUtils from 'utils/Swatch';
import urlUtils from 'utils/Url';
import { wrapFunctionalComponent } from 'utils/framework';

const { getImagePath } = urlUtils;
const { SWATCH_BORDER } = swatchUtils;
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/Swatches/locales', 'Swatches');

const SwatchImage = ({
    src, type, hasOutline, isOutOfStock, isMatch, isOnSale, isNew, isActive, ...props
}) => {
    return (
        <Box
            {...(hasOutline && {
                baseCss: styles.root[type],
                padding: '2px',
                border: 2,
                borderColor: isActive ? 'black' : 'transparent'
            })}
            {...props}
        >
            <img
                src={getImagePath(src)}
                alt=''
                css={[styles.img, type && styles.img[type]]}
            />
            {(isMatch || isOnSale || isNew) && (
                <Flag
                    css={[styles.flag, hasOutline && { bottom: -2 }]}
                    paddingX='.4em'
                    backgroundColor={isMatch ? 'black' : isOnSale ? 'red' : 'black'}
                >
                    {isMatch ? getText('match') : isOnSale ? getText('sale') : getText('new')}
                </Flag>
            )}
            {isMatch && (
                <svg
                    width={22}
                    height={19}
                    css={styles.checkmark}
                >
                    <g>
                        <path
                            fillOpacity='.2'
                            fill='#fff'
                            d='M21.839 4.926L17.202.191 7.971 8.99 4.846 5.798.201 10.543l7.682 7.846z'
                        />
                        <path d='M17.154 3L19 4.886 7.923 15.571 3 10.542l1.846-1.885L7.923 11.8z' />
                    </g>
                </svg>
            )}
            {isOutOfStock && (
                <svg css={[styles.oos, hasOutline && { padding: 8 }]}>
                    <line
                        x1={0}
                        y1='100%'
                        x2='100%'
                        y2={0}
                    />
                </svg>
            )}
        </Box>
    );
};

SwatchImage.defaultProps = {
    position: 'relative'
};

SwatchImage.propTypes = {
    type: PropTypes.string.isRequired,
    src: PropTypes.string.isRequired,
    isMatch: PropTypes.bool,
    isNew: PropTypes.bool,
    isOnSale: PropTypes.bool,
    hasOutline: PropTypes.bool,
    isActive: PropTypes.bool
};

const styles = {
    root: {
        circle: {
            borderRadius: radii.full
        },
        square: {
            borderRadius: radii[3] + 2
        },
        rectangle: {
            borderRadius: radii[3] + 4
        },
        fragrance: {
            borderRadius: radii[2] + 4
        }
    },
    img: {
        overflow: 'hidden',
        display: 'block',
        circle: {
            borderRadius: radii.full,
            width: 36,
            height: 36
        },
        square: {
            borderRadius: radii[3],
            width: 52,
            height: 52
        },
        rectangle: {
            borderRadius: radii[3],
            width: 72,
            height: 36
        },
        fragrance: {
            borderRadius: radii[2],
            width: 40,
            height: 40
        }
    },
    flag: {
        position: 'absolute',
        left: '50%',
        bottom: -SWATCH_BORDER,
        transform: 'translateX(-50%)',
        zIndex: 1
    },
    oos: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100%',
        height: '100%',
        padding: 6,
        transform: 'translate(-50%, -50%)',
        filter: `drop-shadow(0 0 1.75px ${colors.white})`,
        '> line': {
            stroke: colors.black,
            strokeWidth: 2
        }
    },
    checkmark: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    }
};

export default wrapFunctionalComponent(SwatchImage, 'SwatchImage');
