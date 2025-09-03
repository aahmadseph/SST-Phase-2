import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import Cell from 'components/LegacyGrid/LegacyGridCell';
import { Box } from 'components/ui';
import { space } from 'style/config';

function LegacyGrid(fullProps) {
    /* eslint-disable prefer-const */
    let {
        fill, gutter, children, marginX, ...props
    } = fullProps;
    /* eslint-enable prefer-const */

    gutter = gutter ? space[gutter] / 2 : null;

    return (
        <Box
            {...props}
            marginX={gutter ? `-${gutter}px` : marginX}
        >
            {React.Children.map(
                children,
                (child, index) =>
                    child &&
                    React.cloneElement(child, {
                        key: index.toString(),
                        gutter: gutter,
                        equal: fill
                    })
            )}
        </Box>
    );
}

LegacyGrid.propTypes = {
    /** Evenly distribute space amongst all child cells */
    fill: PropTypes.bool,
    /** Space between cells */
    gutter: PropTypes.oneOfType([PropTypes.bool, PropTypes.number])
};

LegacyGrid.defaultProps = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap'
};
LegacyGrid.Cell = Cell;

export default wrapFunctionalComponent(LegacyGrid, 'LegacyGrid');
