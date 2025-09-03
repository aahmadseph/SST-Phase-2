import React from 'react';
import PropTypes from 'prop-types';
import FrameworkUtils from 'utils/framework';
import { mediaQueries, site } from 'style/config';

const { wrapFunctionalComponent } = FrameworkUtils;

function ScrollAnchor({ offset, hasOffset, ...props }) {
    const xsOffset = hasOffset && site.headerHeight + offset;

    return (
        <div
            id={props.id}
            css={{
                position: 'relative',
                zIndex: -1,
                marginTop: -offset,
                paddingTop: offset,
                [mediaQueries.xsMax]: {
                    marginTop: -xsOffset,
                    paddingTop: xsOffset
                }
            }}
        />
    );
}

ScrollAnchor.propTypes = {
    id: PropTypes.string.isRequired,
    offset: PropTypes.number
};

ScrollAnchor.defaultProps = {
    offset: 0
};

export default wrapFunctionalComponent(ScrollAnchor, 'ScrollAnchor');
