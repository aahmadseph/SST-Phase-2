import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import DividerPrimitive from 'components/Divider';
import content from 'constants/content';
import { space, mediaQueries } from 'style/config';

const { COMPONENT_SPACING, DIVIDER_SIZE } = content;

const Divider = ({ marginTop, marginBottom, variantLgui, variantSmui }) => {
    const isLgUiSmall = variantLgui === DIVIDER_SIZE.SM;
    const isSmUiSmall = variantSmui === DIVIDER_SIZE.SM;

    return (
        <DividerPrimitive
            color={[isSmUiSmall ? 'lightGray' : 'nearWhite', isLgUiSmall ? 'lightGray' : 'nearWhite']}
            borderBottom={[`${isSmUiSmall ? 1 : 8}px solid`, `${isLgUiSmall ? 1 : 8}px solid`]}
            css={!isSmUiSmall && styles.divider}
            marginTop={marginTop}
            marginBottom={marginBottom}
        />
    );
};

const styles = {
    divider: {
        marginLeft: space['-container'],
        marginRight: space['-container'],
        [mediaQueries.sm]: {
            marginLeft: 0,
            marginRight: 0
        }
    }
};

Divider.propTypes = {
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    variantLgui: PropTypes.oneOf([DIVIDER_SIZE.SM, DIVIDER_SIZE.LG]),
    variantSmui: PropTypes.oneOf([DIVIDER_SIZE.SM, DIVIDER_SIZE.LG])
};

Divider.defaultProps = {
    marginTop: COMPONENT_SPACING.LG,
    marginBottom: COMPONENT_SPACING.LG,
    variantLgui: DIVIDER_SIZE.SM,
    variantSmui: DIVIDER_SIZE.SM
};

export default wrapFunctionalComponent(Divider, 'Divider');
