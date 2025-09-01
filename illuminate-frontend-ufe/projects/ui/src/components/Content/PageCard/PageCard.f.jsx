import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Text, Flex } from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import {
    colors, radii, shadows, fontWeights, space, mediaQueries, lineHeights
} from 'style/config';
import Media from 'components/Content/Media';
import Action from 'components/Content/Action';
const ActionFlex = Action(Flex);
import constants from 'components/Content/PageCard/constants';

const { VARIANTS, DEFAULT_DIMENSIONS, GRID_DIMENSIONS, CAROUSEL_DIMENSIONS } = constants;

const PageCard = ({
    sid, media, pageLayout, label, description, action, variant, locales
}) => {
    const { isMarkdownLabelsEnabled } = Sephora.configurationSettings;
    const { variantStyles, variantSizes } = getVariantStyles(variant);
    const pageLayoutDisplay = getPageLayoutDisplay(pageLayout, locales);

    return (
        <ActionFlex
            id={sid}
            action={action}
            borderRadius={2}
            gap={3}
            flexDirection='column'
            css={[variantStyles, !media && styles.noMedia]}
        >
            {media && (
                <Media
                    id={media.sid}
                    src={media.src}
                    alt={media.altText}
                    width={variantSizes.LGUI.WIDTH}
                    height={variantSizes.LGUI.HEIGHT}
                    objectFit='cover'
                />
            )}
            <Box
                className='text-container'
                backgroundColor={colors.white}
                css={styles.textContainer}
                data-comp='PageCard'
            >
                {pageLayoutDisplay && (
                    <Text
                        fontSize={'sm-bg'}
                        color={colors.gray}
                        lineHeight={lineHeights.tight}
                        data-at={Sephora.debug.dataAt('page_card_page_type')}
                        dangerouslySetInnerHTML={{
                            __html: pageLayoutDisplay
                        }}
                    />
                )}
                {isMarkdownLabelsEnabled ? (
                    <>
                        <Markdown
                            is={'h3'}
                            fontSize={'md-bg'}
                            marginTop={2}
                            marginBottom={1}
                            fontWeight={fontWeights.demiBold}
                            data-at={Sephora.debug.dataAt('page_card_label')}
                            content={label}
                        />
                        <Markdown
                            fontSize={'base-bg'}
                            lineHeight={lineHeights.tight}
                            data-at={Sephora.debug.dataAt('page_card_description')}
                            content={description}
                        />
                    </>
                ) : (
                    <>
                        <Text
                            is={'h3'}
                            fontSize={'md-bg'}
                            lineHeight={lineHeights.tight}
                            marginTop={2}
                            marginBottom={1}
                            fontWeight={fontWeights.demiBold}
                            data-at={Sephora.debug.dataAt('page_card_label')}
                            dangerouslySetInnerHTML={{
                                __html: label
                            }}
                        />
                        <Text
                            fontSize={'base-bg'}
                            lineHeight={lineHeights.tight}
                            data-at={Sephora.debug.dataAt('page_card_description')}
                            dangerouslySetInnerHTML={{
                                __html: description
                            }}
                        />
                    </>
                )}
            </Box>
        </ActionFlex>
    );
};

const styles = {
    textContainer: {
        fontWeight: fontWeights.normal
    },
    defaultVariant: {
        boxShadow: shadows.light,
        width: `${DEFAULT_DIMENSIONS.LGUI.WIDTH}px`,
        flexShrink: 0,
        img: {
            borderRadius: radii.top
        },
        '.text-container': {
            margin: space[4],
            marginTop: space[0]
        }
    },
    gridVariant: {
        width: `${GRID_DIMENSIONS.SMUI.WIDTH}px`,
        img: {
            borderRadius: radii[2]
        },
        [mediaQueries.sm]: {
            width: `${GRID_DIMENSIONS.LGUI.WIDTH}px`
        }
    },
    carouselVariant: {
        width: `${CAROUSEL_DIMENSIONS.SMUI.WIDTH}px`,
        boxShadow: shadows.light,
        flexShrink: 0,
        img: {
            borderRadius: radii.top
        },
        '.text-container': {
            margin: space[4],
            marginTop: space[0]
        },
        [mediaQueries.sm]: {
            width: `${CAROUSEL_DIMENSIONS.LGUI.WIDTH}px`
        }
    },
    softLinkVariant: {
        width: '100%'
    },
    noMedia: {
        '.text-container': {
            marginTop: space[4]
        }
    }
};

const getVariantStyles = variant => {
    switch (variant) {
        case VARIANTS.GRID:
            return { variantStyles: styles.gridVariant, variantSizes: GRID_DIMENSIONS };
        case VARIANTS.CAROUSEL:
            return { variantStyles: styles.carouselVariant, variantSizes: CAROUSEL_DIMENSIONS };
        case VARIANTS.SOFTLINK:
            return { variantStyles: [styles.defaultVariant, styles.softLinkVariant], variantSizes: DEFAULT_DIMENSIONS };
        default:
            return { variantStyles: styles.defaultVariant, variantSizes: DEFAULT_DIMENSIONS };
    }
};

const getPageLayoutDisplay = (pageLayout, locales) => {
    switch (pageLayout) {
        case 'LayoutDirectory':
        case 'LayoutBuyingGuide':
            return locales.buyingGuide;
        default:
            return '';
    }
};

PageCard.propTypes = {
    sid: PropTypes.string,
    media: PropTypes.object,
    pageLayout: PropTypes.string,
    label: PropTypes.string,
    description: PropTypes.string,
    action: PropTypes.object,
    variant: PropTypes.string
};

PageCard.defaultProps = {
    variant: 'default'
};

export default wrapFunctionalComponent(PageCard, 'PageCard');
