import Chiclet from 'components/Chiclet/Chiclet';
import Flag from 'components/Flag/Flag';
import PropTypes from 'prop-types';
import React from 'react';
import { colors } from 'style/config';
import localeUtils from 'utils/LanguageLocale';
import swatchUtils from 'utils/Swatch';
import { wrapFunctionalComponent } from 'utils/framework';

const { SWATCH_BORDER } = swatchUtils;

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/Swatches/locales', 'Swatches');

const SwatchChiclet = ({
    isOutOfStock, isOnSale, isNew, children, ...props
}) => {
    return (
        <Chiclet
            isLarge={true}
            {...props}
        >
            {children}
            {(isOnSale || isNew) && (
                <Flag
                    css={styles.flag}
                    paddingX='.4em'
                    backgroundColor={isOnSale ? 'red' : 'black'}
                >
                    {isOnSale ? getText('sale') : getText('new')}
                </Flag>
            )}
            {isOutOfStock && (
                <svg css={styles.oos}>
                    <line
                        x1={0}
                        y1='100%'
                        x2='100%'
                        y2={0}
                    />
                </svg>
            )}
        </Chiclet>
    );
};

SwatchChiclet.propTypes = {
    isNew: PropTypes.bool,
    isOnSale: PropTypes.bool,
    isOutOfStock: PropTypes.bool
};

const styles = {
    flag: {
        position: 'absolute',
        left: '50%',
        bottom: -(SWATCH_BORDER + 3),
        transform: 'translateX(-50%)',
        zIndex: 1
    },
    oos: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        width: '100%',
        height: '100%',
        transform: 'translate(-50%, -50%)',
        filter: `drop-shadow(0 0 1.75px ${colors.white})`,
        '> line': {
            stroke: colors.black,
            strokeWidth: 2
        }
    }
};

export default wrapFunctionalComponent(SwatchChiclet, 'SwatchChiclet');
