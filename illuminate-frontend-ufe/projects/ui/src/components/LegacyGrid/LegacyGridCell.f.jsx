import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box } from 'components/ui';

function LegacyGridCell(fullProps) {
    const { width, equal, gutter, ...props } = fullProps;

    const fit = width === 'fit';
    const fill = width === 'fill';

    const styles = {
        // Use `flex-basis: auto` with a width to avoid box-sizing bug in IE10/11
        // http://git.io/vllMD
        flexBasis: fill ? '0%' : width ? 'auto' : '100%',

        // Fix issue where elements with overflow extend past the cell
        // https://git.io/vw5oF
        flex: fill ? 1 : equal ? '1 1 0%' : null,
        paddingLeft: gutter,
        paddingRight: gutter
    };

    return (
        <Box
            {...props}
            baseCss={styles}
            width={fit || fill ? null : width}
        />
    );
}

LegacyGridCell.propTypes = {
    width: PropTypes.oneOfType([
        PropTypes.bool,
        PropTypes.number,
        PropTypes.string,
        PropTypes.oneOf([
            'fill', // Make cell fill the remaining space
            'fit' // Make cell shrink wrap its content
        ])
    ])
};

LegacyGridCell.defaultProps = {
    minWidth: 0,
    width: '100%'
};

export default wrapFunctionalComponent(LegacyGridCell, 'LegacyGridCell');
