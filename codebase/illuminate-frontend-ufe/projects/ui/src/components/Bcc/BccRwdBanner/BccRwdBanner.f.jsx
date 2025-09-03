import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex, Image } from 'components/ui';
import { breakpoints, mediaQueries } from 'style/config';
import ImageUtils from 'utils/Image';
import Markdown from 'components/Markdown/Markdown';
import BccRwdLinkHOC from 'components/Bcc/BccRwdLinkHOC/BccRwdLinkHOC';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';

const { getImageSrc } = ImageUtils;
const FlexLink = BccRwdLinkHOC(Flex);

/* eslint-disable-next-line complexity */
function BccRwdBanner(props) {
    const {
        backgroundColor,
        componentList,
        markdownText,
        imageAltText,
        imageLargeViewPortHeight,
        imageLargeViewPortSource,
        imageLargeViewPortWidth,
        imageSmallViewPortHeight,
        imageSmallViewPortSource,
        imageSmallViewPortWidth,
        liveText, // not actually text; property is for text placement
        context,
        enablePageRenderTracking,
        targetUrl,
        modalComponent
    } = props;

    const isContained = context === 'container';
    const isInline = context === 'inline';
    const hasImage = Boolean(imageSmallViewPortSource || imageLargeViewPortSource);
    const isTextTop = liveText === 'Top';
    const isTextRight = liveText === 'Right';
    const isTextBottom = liveText === 'Bottom';
    const isTextLeft = liveText === 'Left';

    if (!markdownText && !hasImage) {
        return null;
    }

    // if multi link, only the markdown area should link otherwise link the entire banner
    const isMultiLink = componentList?.length > 0 && (targetUrl || modalComponent);
    const WrapperComp = isMultiLink ? Flex : FlexLink;
    const TextWrapComp = isMultiLink ? FlexLink : Flex;
    const LinkProps = {
        bccProps: props,
        css: styles.link,
        useInternalTracking: true
    };

    return (
        <Box
            className='Banner'
            backgroundColor={backgroundColor}
            {...(markdownText && {
                borderRadius: 2,
                overflow: 'hidden'
            })}
            {...(!backgroundColor &&
                markdownText && {
                borderWidth: 1,
                borderColor: 'midGray'
            })}
            {...(backgroundColor &&
                isContained && {
                marginX: ['-container', 0],
                borderRadius: [null, 2]
            })}
        >
            <WrapperComp
                {...(isMultiLink || LinkProps)}
                flexDirection={isTextRight || isTextLeft ? (isInline ? 'row' : ['column', 'row']) : 'column'}
                width='100%'
            >
                {markdownText && (
                    <TextWrapComp
                        {...(isMultiLink && LinkProps)}
                        flexDirection='column'
                        justifyContent={isTextTop || isTextBottom || 'center'}
                        lineHeight={isContained || 'tight'}
                        fontSize={isInline && ['sm', 'base']}
                        paddingY={isInline ? '.5em' : 4}
                        paddingX={isContained ? ['container', 5, 6] : isInline ? '1em' : [4, null, 5]}
                        flex={1}
                    >
                        <Markdown
                            content={markdownText}
                            css={styles.markdown}
                        />
                    </TextWrapComp>
                )}
                {hasImage && (
                    <Box
                        position='relative'
                        maxWidth={markdownText && (isTextRight || isTextLeft) ? ['100%', '50%'] : '100%'}
                        marginX={!markdownText && 'auto'}
                        width={[imageSmallViewPortWidth, imageLargeViewPortWidth]}
                        order={(isTextRight || isTextBottom) && -1}
                    >
                        <picture
                            css={{
                                display: 'block',
                                paddingBottom: `${(imageSmallViewPortHeight / imageSmallViewPortWidth) * 100}%`,
                                [mediaQueries.sm]: imageLargeViewPortSource && {
                                    paddingBottom: `${(imageLargeViewPortHeight / imageLargeViewPortWidth) * 100}%`
                                }
                            }}
                        >
                            {imageSmallViewPortSource && imageLargeViewPortSource && (
                                <source
                                    media={breakpoints.xsMax}
                                    srcSet={getImageSrc(imageSmallViewPortSource, imageSmallViewPortWidth, true)}
                                />
                            )}
                            <Image
                                size='100%'
                                isPageRenderImg={enablePageRenderTracking}
                                src={
                                    imageLargeViewPortSource
                                        ? getImageSrc(imageLargeViewPortSource, imageLargeViewPortWidth)
                                        : getImageSrc(imageSmallViewPortSource, imageSmallViewPortWidth)
                                }
                                srcSet={
                                    imageLargeViewPortSource
                                        ? getImageSrc(imageLargeViewPortSource, imageLargeViewPortWidth, true)
                                        : getImageSrc(imageSmallViewPortSource, imageSmallViewPortWidth, true)
                                }
                                alt={imageAltText}
                                css={styles.img}
                            />
                        </picture>
                        {componentList?.length > 0 && (
                            <Flex
                                position='absolute'
                                inset={0}
                            >
                                {componentList.map(item => (
                                    <FlexLink
                                        useInternalTracking={true}
                                        key={`banner_link_${item.targetUrl || item.name}`}
                                        bccProps={item}
                                        title={item.titleText}
                                        flex={1}
                                        opacity={0}
                                        backgroundColor='white'
                                        css={{
                                            transition: 'opacity .2s',
                                            '.no-touch &:hover': {
                                                opacity: 0.4
                                            }
                                        }}
                                    />
                                ))}
                            </Flex>
                        )}
                    </Box>
                )}
            </WrapperComp>
            {enablePageRenderTracking && <PageRenderReport />}
        </Box>
    );
}

const styles = {
    link: {
        '.no-touch button&:hover, .no-touch a&:hover': {
            '& p, & p span': {
                textDecoration: 'underline'
            }
        }
    },
    img: {
        position: 'absolute',
        top: 0,
        left: 0,
        objectFit: 'contain'
    },
    markdown: {
        '& h2': {
            marginBottom: '.125em'
        }
    }
};

BccRwdBanner.propTypes = {
    backgroundColor: PropTypes.string,
    context: PropTypes.oneOf(['container', 'modal', 'inline']),
    componentName: PropTypes.string,
    componentList: PropTypes.array,
    componentType: PropTypes.number,
    enablePageRenderTracking: PropTypes.bool,
    enableTesting: PropTypes.bool,
    isTopPriority: PropTypes.bool,
    imageAltText: PropTypes.string,
    imageLargeViewPortHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imageLargeViewPortSource: PropTypes.string,
    imageLargeViewPortWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imageSmallViewPortHeight: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    imageSmallViewPortSource: PropTypes.string,
    imageSmallViewPortWidth: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    liveText: PropTypes.oneOf(['Top', 'Right', 'Bottom', 'Left']),
    markdownText: PropTypes.string,
    name: PropTypes.string,
    style: PropTypes.object,
    targetUrl: PropTypes.string,
    targerWindow: PropTypes.number,
    onClick: PropTypes.func
};

BccRwdBanner.defaultProps = {
    enablePageRenderTracking: false
};

export default wrapFunctionalComponent(BccRwdBanner, 'BccRwdBanner');
