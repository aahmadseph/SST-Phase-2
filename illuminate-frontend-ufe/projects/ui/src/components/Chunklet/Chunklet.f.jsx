import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Image } from 'components/ui';
import { colors, space } from 'style/config';
import Media from 'components/Content/Media';

const ICON_SIZE = 28;

function Chunklet({
    children, image, isPageRenderImg, media, ...props
}) {
    const iconSize = props.iconSize || ICON_SIZE;
    const minHeight = Array.isArray(iconSize) ? iconSize.map(is => is + space[4]) : iconSize + space[4];

    return (
        <Box
            display='inline-flex'
            alignItems='center'
            lineHeight='tight'
            fontSize={['sm', 'base']}
            paddingX={3}
            paddingY='.25em'
            gap={2}
            minHeight={minHeight}
            boxShadow='light'
            borderRadius={2}
            baseCss={{
                transition: 'color .2s',
                '.no-touch &:hover': {
                    color: colors.gray
                }
            }}
            {...props}
        >
            <span
                css={{ flex: 1 }}
                children={children}
            />
            {image && (
                <Image
                    src={image}
                    isPageRenderImg={isPageRenderImg}
                    size={iconSize}
                    style={{
                        filter: props.disabled ? 'opacity(0.5)' : 'none'
                    }}
                />
            )}
            {media && (
                <Media
                    {...media}
                    isPageRenderImg={isPageRenderImg}
                    size={iconSize}
                />
            )}
        </Box>
    );
}

Chunklet.propTypes = {
    children: PropTypes.any.isRequired,
    image: PropTypes.string,
    media: PropTypes.object,
    isPageRenderImg: PropTypes.bool
};

Chunklet.defaultProps = {
    image: null,
    media: null,
    isPageRenderImg: null
};

export default wrapFunctionalComponent(Chunklet, 'Chunklet');
