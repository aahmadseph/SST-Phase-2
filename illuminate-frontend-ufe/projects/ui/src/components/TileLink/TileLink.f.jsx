import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Flex, Image } from 'components/ui';
import { fontSizes, lineHeights, space } from 'style/config';
import Media from 'components/Content/Media';

const ICON_SIZE = [48, 53];

function TileLink({
    children, image, isPageRenderImg, media, flexWidth, ...props
}) {
    return (
        <Flex
            width={!flexWidth && [90, 110]}
            minHeight={[
                ICON_SIZE[0] + space[2] * 3 + fontSizes.sm * lineHeights.tight * 3,
                ICON_SIZE[1] + space[2] * 3 + fontSizes.base * lineHeights.tight * 3
            ]}
            flexDirection='column'
            lineHeight='tight'
            fontSize={['sm', 'base']}
            padding={2}
            gap={2}
            boxShadow='light'
            borderRadius={2}
            baseCss={{
                '.no-touch &': {
                    transition: 'transform .2s',
                    '&:hover': {
                        transform: `translateY(-${space[1]}px)`
                    }
                }
            }}
            {...props}
        >
            {children}
            {(image || media) && (
                <Flex
                    justifyContent='flex-end'
                    marginTop='auto'
                >
                    {image ? (
                        <Image
                            src={image}
                            isPageRenderImg={isPageRenderImg}
                            size={ICON_SIZE}
                        />
                    ) : (
                        <Media
                            {...media}
                            isPageRenderImg={isPageRenderImg}
                            size={ICON_SIZE}
                        />
                    )}
                </Flex>
            )}
        </Flex>
    );
}

TileLink.propTypes = {
    children: PropTypes.any.isRequired,
    image: PropTypes.string,
    media: PropTypes.object,
    flexWidth: PropTypes.bool,
    isPageRenderImg: PropTypes.bool
};

TileLink.defaultProps = {
    image: null,
    media: null,
    flexWidth: false,
    isPageRenderImg: null
};

export default wrapFunctionalComponent(TileLink, 'TileLink');
