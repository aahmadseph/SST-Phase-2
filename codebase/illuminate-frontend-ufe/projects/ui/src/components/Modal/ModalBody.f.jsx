import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { mediaQueries, modal } from 'style/config';
import { Box } from 'components/ui';

const ModalBody = React.forwardRef(({
    height, maxHeight, padForX, bodyDataAt, ...props
}, ref) => {
    // add top padding space for closing "X" for modals without a header
    if (padForX) {
        props.paddingTop = modal.headerHeight;
    }

    return (
        <Box
            ref={ref}
            overflowY='auto'
            data-at={Sephora.debug.dataAt(bodyDataAt || 'modal_body')}
            baseCss={{
                [mediaQueries.sm]: {
                    flexBasis: height,
                    maxHeight
                }
            }}
            {...props}
        />
    );
});

ModalBody.defaultProps = {
    position: 'relative',
    flex: 1,
    paddingX: modal.paddingX,
    paddingTop: modal.paddingSm,
    paddingBottom: modal.paddingLg
};

export default wrapFunctionalComponent(ModalBody, 'ModalBody');
