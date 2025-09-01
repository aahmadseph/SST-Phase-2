import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    colors, modal, space, mediaQueries
} from 'style/config';
import { Box } from 'components/ui';

function ModalHeader(props) {
    const {
        showDismiss, isLeftAligned, idPrefix, children, isGalleryLightBox = false, hasBorder = true, ...rest
    } = props;

    const xPad = modal.xSize + space[2];

    return (
        <Box
            baseCss={[
                {
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    flexShrink: 0,
                    ...(hasBorder && {
                        borderBottom: `1px solid ${colors.lightGray}`
                    }),
                    minHeight: !isGalleryLightBox && modal.headerHeight,
                    textAlign: 'center',
                    paddingTop: modal.paddingSm,
                    paddingBottom: modal.paddingSm,
                    paddingRight: modal.paddingX[0],
                    paddingLeft: modal.paddingX[0],
                    [mediaQueries.sm]: {
                        paddingRight: modal.paddingX[1],
                        paddingLeft: modal.paddingX[1]
                    },
                    ...(isGalleryLightBox && {
                        height: '33px'
                    })
                },
                showDismiss && {
                    paddingRight: modal.paddingX[0] + xPad,
                    paddingLeft: modal.paddingX[0] + xPad,
                    [mediaQueries.sm]: {
                        paddingRight: modal.paddingX[1] + xPad,
                        paddingLeft: modal.paddingX[1] + xPad
                    }
                },
                isLeftAligned && {
                    textAlign: 'left',
                    paddingLeft: modal.paddingX[0],
                    [mediaQueries.sm]: {
                        paddingLeft: modal.paddingX[1]
                    }
                }
            ]}
            {...rest}
        >
            {React.Children.map(
                children,
                (child, index) =>
                    child &&
                    React.cloneElement(child, {
                        key: index.toString(),
                        idPrefix: idPrefix
                    })
            )}
        </Box>
    );
}

export default wrapFunctionalComponent(ModalHeader, 'ModalHeader');
