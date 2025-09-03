import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import RichText from 'components/Content/RichText';
import StyleWrap from 'components/Content/StyleWrap';
import contentConstants from 'constants/content';

const { COMPONENT_SPACING } = contentConstants;

const Copy = ({
    sid, content, marginTop, marginBottom, style
}) => {
    if (!content) {
        return null;
    }

    return (
        <StyleWrap
            sid={sid}
            style={{
                marginTop,
                marginBottom,
                ...style
            }}
        >
            <RichText content={content} />
        </StyleWrap>
    );
};

Copy.propTypes = {
    sid: PropTypes.string,
    content: PropTypes.object,
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    style: PropTypes.object
};

Copy.defaultProps = {
    sid: null,
    content: null,
    marginTop: COMPONENT_SPACING.MD,
    marginBottom: COMPONENT_SPACING.MD,
    style: null
};

export default wrapFunctionalComponent(Copy, 'Copy');
