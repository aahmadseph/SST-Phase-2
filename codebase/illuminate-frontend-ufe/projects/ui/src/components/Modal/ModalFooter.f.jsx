import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    colors, modal, mediaQueries, space
} from 'style/config';
import { Box } from 'components/ui';
import UI from 'utils/UI';

function ModalFooter(props) {
    const { hasBodyScroll, hasBorder, ...rest } = props;

    return (
        <Box
            baseCss={[
                {
                    position: 'relative',
                    zIndex: 1,
                    flexShrink: 0,
                    paddingBottom: UI.isIOS() ? modal.paddingXs + space[3] : modal.paddingXs,
                    [mediaQueries.sm]: {
                        paddingBottom: modal.paddingSm
                    }
                },
                ((hasBodyScroll && hasBorder !== false) || hasBorder) && {
                    paddingTop: modal.paddingXs,
                    borderTopWidth: 1,
                    borderColor: colors.lightGray,
                    [mediaQueries.sm]: {
                        paddingTop: modal.paddingSm
                    }
                }
            ]}
            {...rest}
        />
    );
}

ModalFooter.defaultProps = {
    paddingX: modal.paddingX
};

export default wrapFunctionalComponent(ModalFooter, 'ModalFooter');
