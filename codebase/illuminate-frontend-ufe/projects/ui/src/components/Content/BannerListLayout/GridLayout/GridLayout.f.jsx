import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { mediaQueries } from 'style/config';
import { Grid } from 'components/ui';
import constants from 'constants/content';

const { CONTEXTS } = constants;

const COLUMNS = {
    '2-Column': 2,
    '3-Column': 3,
    '4-Column': 4
};

const GAPS = {
    SMALL: 'small',
    LARGE: 'large'
};

const GridLayout = React.forwardRef((props, ref) => {
    const {
        sid, context, marginBottom, marginTop, banners, variant, gap
    } = props;
    const isContained = context === CONTEXTS.CONTAINER || context === CONTEXTS.MODAL;
    const numberOfColumns = COLUMNS[variant];

    return (
        <Grid
            id={sid}
            marginTop={marginTop}
            marginBottom={marginBottom}
            css={isContained && styles.contained(numberOfColumns)}
            ref={ref}
            gap={[4, gap === GAPS.SMALL ? null : 5]}
        >
            {banners}
        </Grid>
    );
});

const styles = {
    contained: columns => {
        return {
            position: 'relative',
            width: '100%',
            padding: 0,
            paddingLeft: '-15px',
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
            [mediaQueries.xsMax]: {
                gridTemplateColumns: '1fr'
            }
        };
    }
};

GridLayout.propTypes = {
    variant: PropTypes.oneOf(Object.keys(COLUMNS)),
    gap: PropTypes.oneOf([GAPS.LARGE, GAPS.SMALL]),
    banners: PropTypes.array,
    context: PropTypes.oneOf(Object.values(CONTEXTS)),
    marginBottom: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    marginTop: PropTypes.oneOfType([PropTypes.string, PropTypes.number, PropTypes.array]),
    sid: PropTypes.string
};

GridLayout.defaultProps = {
    variant: '2-Column',
    gap: GAPS.LARGE
};

export default wrapFunctionalComponent(GridLayout, 'GridLayout');
