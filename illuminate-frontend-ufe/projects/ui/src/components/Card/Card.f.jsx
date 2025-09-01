import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import helpersUtils from 'utils/Helpers';
import { Box, Flex, Text } from 'components/ui';
import {
    colors, fontSizes, space, radii, fontWeights, lineHeights, mediaQueries
} from 'style/config';
import Markdown from 'components/Markdown/Markdown';
import Media from 'components/Content/Media';
import Action from 'components/Content/Action';

const { replaceDoubleAsterisks } = helpersUtils;

const ActionFlex = Action(Flex);

const ICON_SIZE = 16;

const TitleComponent = ({ title, isMixed, titleIsHighlighted }) => {
    if (!title) {
        return null;
    }

    return (
        <Text
            is='h2'
            fontWeight={titleIsHighlighted ? 700 : 400}
            marginBottom={isMixed ? 2 : 1}
            fontSize='md'
        >
            {title}
        </Text>
    );
};

const AboveTitleComponent = ({ textAboveTheTitle, isVertical, isMixed, customStyles }) => {
    if (!textAboveTheTitle) {
        return null;
    }

    return (
        <Text
            is='p'
            fontSize={isVertical ? fontSizes.base : fontSizes.sm}
            css={[styles.aboveTitle, isMixed && styles.aboveTheTitleMixed, customStyles?.aboveTitle]}
        >
            {textAboveTheTitle}
        </Text>
    );
};

const BelowTitleComponent = ({ textBelowTheTitle, imageBelowTheTitle }) => {
    if (!textBelowTheTitle) {
        return null;
    }

    return (
        <Flex
            direction='column'
            marginBottom={2}
        >
            {imageBelowTheTitle && (
                <Box
                    marginRight={1}
                    minWidth={ICON_SIZE}
                >
                    <Media
                        {...imageBelowTheTitle}
                        size={ICON_SIZE}
                    />
                </Box>
            )}
            <MarkdownComponent content={textBelowTheTitle} />
        </Flex>
    );
};

const MarkdownComponent = ({ content, cssStyles }) => {
    if (!content) {
        return null;
    }

    return (
        <Markdown
            css={cssStyles}
            content={replaceDoubleAsterisks(content)}
        />
    );
};

// eslint-disable-next-line complexity
const ImageComponent = ({
    isVertical, isMixed, datasource, parameters, customStyles
}) => {
    const { image, marketingFlagText } = datasource;
    const {
        marketingFlagBackgroundColor, layout, layoutLgui, imageWidth, withBorder, imageWidthLgui
    } = parameters;

    let SMUI_IMG_WIDTH, LGUI_IMG_WIDTH;

    if (layout === 'sideBySide' && layoutLgui === 'vertical') {
        SMUI_IMG_WIDTH = imageWidth || 72;
        LGUI_IMG_WIDTH = imageWidthLgui || 96;
    } else {
        SMUI_IMG_WIDTH = imageWidth || isMixed ? 114 : 105;
        LGUI_IMG_WIDTH = imageWidthLgui || imageWidth || isMixed ? 150 : 210;
    }

    return (
        <Box
            css={[
                isVertical && withBorder ? styles.imageContainerVertical : styles.imageContainer,
                !(layout === 'sideBySide' && layoutLgui === 'vertical') && customStyles?.imageContainer
            ]}
            minWidth={layout === 'sideBySide' || !isVertical ? [SMUI_IMG_WIDTH, LGUI_IMG_WIDTH] : null}
            maxWidth={layout === 'sideBySide' || !isVertical ? [SMUI_IMG_WIDTH, LGUI_IMG_WIDTH] : null}
            marginRight={!isVertical && isMixed ? [2, 0] : 0}
        >
            {image && (
                <Media
                    {...image}
                    size={['100%', image.width]}
                />
            )}
            {marketingFlagText && (
                <Text
                    css={styles.badge}
                    backgroundColor={marketingFlagBackgroundColor}
                >
                    {marketingFlagText}
                </Text>
            )}
        </Box>
    );
};

const TextComponent = ({
    isVertical, isMixed, datasource, parameters, customStyles
}) => {
    const {
        title, description, textAboveTheTitle, textBelowTheTitle, imageBelowTheTitle, textBelowNotes, notes, actionLabel
    } = datasource;
    const { titleIsHighlighted, withBorder, layout } = parameters;

    return (
        <Box
            css={[styles.textContainer, isVertical && withBorder && styles.textContainerVertical, isMixed && styles.textContainerMixed]}
            marginLeft={layout === 'sideBySide' || !isVertical ? (isVertical ? [3, 0] : [3, 4]) : 0}
        >
            {!isMixed && (
                <AboveTitleComponent
                    textAboveTheTitle={textAboveTheTitle}
                    isVertical={isVertical}
                    customStyles={customStyles}
                />
            )}
            {!isMixed && (
                <TitleComponent
                    title={title}
                    isVertical={isVertical}
                    titleIsHighlighted={titleIsHighlighted}
                />
            )}
            <BelowTitleComponent
                textBelowTheTitle={textBelowTheTitle}
                imageBelowTheTitle={imageBelowTheTitle}
            />
            {description && (
                <Text
                    css={[styles.body, customStyles?.description]}
                    is='p'
                >
                    {description}
                </Text>
            )}
            <MarkdownComponent
                cssStyles={styles.notes}
                content={notes}
            />
            <MarkdownComponent
                cssStyles={styles.markdownContent}
                content={textBelowNotes}
            />
            {actionLabel && (
                <Text
                    is='h2'
                    fontWeight={'bold'}
                    fontSize='base'
                    className='CardCTA'
                    marginTop={1}
                >
                    {actionLabel}
                </Text>
            )}
        </Box>
    );
};

// eslint-disable-next-line complexity
const Card = ({ datasource, parameters, customStyles = {} }) => {
    const { title, textAboveTheTitle, action } = datasource;
    const { layout, titleIsHighlighted, layoutLgui, withBorder } = parameters;

    const isVertical = (layoutLgui && layoutLgui === 'vertical') || layout === 'vertical';
    const isMixed = (layoutLgui && layoutLgui === 'mixed') || layout === 'mixed';

    let flexDirectionValue = 'row';

    if (layout === 'sideBySide' && layoutLgui === 'vertical') {
        flexDirectionValue = ['row', 'column'];
    } else if (layout === 'vertical' || layoutLgui === 'vertical' || isMixed) {
        flexDirectionValue = 'column';
    } else if (layout === 'sideBySide') {
        flexDirectionValue = 'row';
    }

    const Component = (
        <>
            {isMixed && (
                <Box>
                    <AboveTitleComponent
                        textAboveTheTitle={textAboveTheTitle}
                        isVertical={isVertical}
                        customStyles={customStyles}
                        isMixed={isMixed}
                    />
                    <TitleComponent
                        title={title}
                        isVertical={isVertical}
                        isMixed={isMixed}
                        titleIsHighlighted={titleIsHighlighted}
                    />
                </Box>
            )}

            {isMixed ? (
                <Flex direction='column'>
                    <ImageComponent
                        isVertical={isVertical}
                        isMixed={isMixed}
                        parameters={parameters}
                        datasource={datasource}
                        customStyles={customStyles}
                    />
                    <TextComponent
                        isVertical={isVertical}
                        isMixed={isMixed}
                        parameters={parameters}
                        datasource={datasource}
                        customStyles={customStyles}
                    />
                </Flex>
            ) : (
                <>
                    <ImageComponent
                        isVertical={isVertical}
                        isMixed={isMixed}
                        parameters={parameters}
                        datasource={datasource}
                        customStyles={customStyles}
                    />
                    <TextComponent
                        isVertical={isVertical}
                        isMixed={isMixed}
                        parameters={parameters}
                        datasource={datasource}
                        customStyles={customStyles}
                    />
                </>
            )}
        </>
    );

    if (!action) {
        return (
            <Flex
                flexDirection={flexDirectionValue}
                css={[styles.root, withBorder ? styles.containerBorder : styles.container, isMixed && styles.containerMixed]}
            >
                {Component}
            </Flex>
        );
    }

    return (
        <ActionFlex
            sid={action.sid}
            action={action}
            flexDirection={flexDirectionValue}
            css={[styles.root, withBorder ? styles.containerBorder : styles.container, isMixed && styles.containerMixed]}
            title={title}
        >
            {Component}
        </ActionFlex>
    );
};

const styles = {
    root: {
        '.no-touch &:hover, &:focus-within': {
            '& .CardCTA': {
                textDecoration: 'underline'
            }
        }
    },
    container: {
        width: '100%',
        lineHeight: lineHeights.tight
    },
    containerMixed: {
        padding: space[3]
    },
    imageContainer: {
        position: 'relative',
        width: '100%',
        marginBottom: space[4],
        '& img': {
            borderRadius: radii[2]
        }
    },
    badge: {
        position: 'absolute',
        top: space[1],
        left: space[1],
        color: colors.white,
        fontSize: fontSizes.xs,
        borderRadius: radii[2],
        fontWeight: fontWeights.bold,
        paddingLeft: 6,
        paddingRight: 6
    },
    aboveTitle: {
        color: colors.gray,
        marginBottom: space[2],
        marginTop: space[2]
    },
    aboveTheTitleMixed: {
        marginBottom: space[1]
    },
    body: {
        fontSize: fontSizes.base,
        marginBottom: space[2]
    },
    markdownContent: {
        fontSize: fontSizes.base,
        [mediaQueries.md]: {
            fontSize: fontSizes.md
        },
        '& em': {
            fontStyle: 'normal'
        }
    },
    notes: {
        color: colors.gray,
        marginBottom: space[2],
        fontSize: fontSizes.sm,
        '& p': {
            marginBottom: space[1]
        }
    },
    containerBorder: {
        width: '100%',
        lineHeight: lineHeights.tight,
        boxShadow: '0px 0px 6px 0px rgba(0, 0, 0, 0.20)',
        backdropFilter: 'blur(40px)',
        borderRadius: '4px',
        '& .CarouselCard': {
            opacity: 0,
            transition: 'opacity .2s'
        },
        '.no-touch a&': {
            transition: 'transform .2s',
            '&:hover': {
                transform: `translateY(-${space[1]}px)`
            }
        },
        '.no-touch &:hover, &:focus-within': {
            '& .CarouselCard': {
                opacity: 1
            }
        }
    },
    imageContainerVertical: {
        position: 'relative',
        width: '100%',
        '& img': {
            borderTopLeftRadius: radii[2],
            borderTopRightRadius: radii[2]
        }
    },
    textContainerMixed: {
        minWidth: '140px'
    },
    textContainerVertical: {
        padding: space[4]
    }
};

Card.propTypes = {
    type: PropTypes.string,
    datasource: PropTypes.shape({
        image: PropTypes.object,
        marketingFlagText: PropTypes.string,
        title: PropTypes.string,
        description: PropTypes.string,
        textAboveTheTitle: PropTypes.string,
        textBelowTheTitle: PropTypes.string,
        action: PropTypes.object,
        actionLabel: PropTypes.string
    }),
    parameters: PropTypes.shape({
        marketingFlagBackgroundColor: PropTypes.oneOf(['red', 'black']),
        layout: PropTypes.oneOf(['vertical', 'sideBySide', 'mixed']),
        titleIsHighlighted: PropTypes.bool
    }),
    customStyles: PropTypes.object,
    isCarousel: PropTypes.bool
};

Card.defaultProps = {
    type: null,
    datasource: {
        image: null,
        marketingFlagText: null,
        title: null,
        description: null,
        textAboveTheTitle: null,
        textBelowTheTitle: null,
        action: null
    },
    parameters: {
        marketingFlagBackgroundColor: 'black',
        layout: 'vertical',
        titleIsHighlighted: true
    },
    isCarousel: false
};

export default wrapFunctionalComponent(Card, 'Card');
