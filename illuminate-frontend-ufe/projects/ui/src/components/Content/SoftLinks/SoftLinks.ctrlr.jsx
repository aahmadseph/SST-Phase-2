import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import RichText from 'components/Content/RichText';
import content from 'constants/content';
import { space, mediaQueries } from 'style/config';
import { Box, Text } from 'components/ui';
import BaseClass from 'components/BaseClass';
import Chunklet from 'components/Chunklet';
import TileLink from 'components/TileLink';
import Action from 'components/Content/Action';
import PageCard from 'components/Content/PageCard';
import Carousel from 'components/Carousel';
import constants from 'components/Content/PageCard/constants';

import anaConsts from 'analytics/constants';
import { sendCmsComponentEvent } from 'analytics/utils/cmsComponents';

const {
    COMPONENT_TYPES: { SOFT_LINKS }
} = content;

const {
    CMS_COMPONENT_EVENTS: { IMPRESSION, ITEM_CLICK }
} = anaConsts;

const { DEFAULT_DIMENSIONS } = constants;
const { COMPONENT_SPACING, CONTEXTS } = content;
const ActionChunklet = Action(Chunklet);
const ActionTile = Action(TileLink);

const GAP = space[2];

const VARIANTS = {
    TILE: 'tile',
    CHUNKLET: 'chunklet',
    CARD: 'card'
};

const ACTION_VARIANTS = {
    [VARIANTS.TILE]: ActionTile,
    [VARIANTS.CHUNKLET]: ActionChunklet,
    [VARIANTS.CARD]: PageCard
};

const DISPLAY_VARIANTS = {
    CAROUSEL: 'Carousel',
    GRID: 'Grid'
};

const getItemWidth = variant => {
    switch (variant) {
        case VARIANTS.TILE:
            return [90, 110];
        case VARIANTS.CHUNKLET:
            return 201;
        default:
            return DEFAULT_DIMENSIONS.LGUI.WIDTH;
    }
};

class SoftLinks extends BaseClass {
    triggerClick(target, itemIndex) {
        const { personalizedComponent, personalization, ...restProps } = this.props;

        const { sid, title } = personalizedComponent?.variationData || restProps;

        const currentItem = {
            ...target,
            itemIndex
        };

        sendCmsComponentEvent({
            items: [currentItem],
            eventName: ITEM_CLICK,
            component: SOFT_LINKS,
            p13n: personalization,
            title,
            sid
        });
    }

    handleClick = (link, index) => event => {
        event.preventDefault();
        event.stopPropagation();

        this.triggerClick(link, index);

        if (this.props.trackSoftLink) {
            this.props.trackSoftLink(link);
        }
    };

    render() {
        const { personalizedComponent, personalization, ...restProps } = this.props;

        const {
            sid, title, text, context, variant, displayVariant, items, marginTop, marginBottom, moreLinks
        } =
            personalizedComponent?.variationData || restProps;

        if (!items) {
            return null;
        }

        const triggerImpression = function (targets) {
            const currentItems = items
                .map((item, index) => ({
                    ...item,
                    itemIndex: index
                }))
                .filter((item, index) => targets.includes(index));

            sendCmsComponentEvent({
                items: currentItems,
                eventName: IMPRESSION,
                component: SOFT_LINKS,
                p13n: personalization,
                title,
                sid
            });
        };

        const hasText = Boolean(text);
        const isTile = variant === VARIANTS.TILE;
        const useInlineTitle = items.length < 9 && isTile && title;
        const isCard = variant === VARIANTS.CARD;
        const ActionComponent = ACTION_VARIANTS[variant];

        const TitleHeader = () => (
            <Box>
                <Text
                    is='h2'
                    lineHeight='tight'
                    marginBottom={hasText ? '.25em' : 4}
                    {...(moreLinks ? styles.largeTitle : styles.title[variant])}
                    children={title}
                />
                {hasText && (
                    <Box marginBottom={4}>
                        <RichText content={text} />
                    </Box>
                )}
            </Box>
        );

        return (
            <Box
                id={sid}
                marginTop={marginTop}
                marginBottom={marginBottom}
                css={useInlineTitle && styles.flexContainer}
            >
                {displayVariant === DISPLAY_VARIANTS.CAROUSEL ? (
                    <>
                        {title && <TitleHeader />}
                        <Carousel
                            marginX='-container'
                            scrollPadding={[2, 'container']}
                            itemWidth={getItemWidth(variant)}
                            gap={isCard ? [2, 3] : 2}
                            hasShadowHack={true}
                            paddingY={2}
                            onImpression={triggerImpression}
                            items={items.map((link, itemIndex) => {
                                return (
                                    <ActionComponent
                                        {...link}
                                        key={`${link.sid}_${itemIndex}`}
                                        sid={link.sid}
                                        action={link.action}
                                        children={link.label || link.action?.title} // action.title is deprecated\
                                        pageLayout={link.action?.page?.layout?.type || ''}
                                        media={link.media}
                                        onClick={this.handleClick(link, itemIndex)}
                                        css={{ wordBreak: 'break-word' }}
                                    />
                                );
                            })}
                        />
                    </>
                ) : (
                    <>
                        {title && (
                            <div css={useInlineTitle && styles.flexTitle}>
                                <TitleHeader />
                            </div>
                        )}
                        <ul css={[styles.list, styles.list[variant], styles.list[variant][context]]}>
                            {items.map((link, index) => {
                                return (
                                    <li
                                        key={link.action.sid}
                                        css={[styles.item, isTile && styles.tileItem]}
                                    >
                                        <ActionComponent
                                            {...link}
                                            sid={link.sid}
                                            action={link.action}
                                            children={link.label || link.action?.title} // action.title is deprecated
                                            media={link.media}
                                            pageLayout={link.action?.page?.layout?.type || ''}
                                            variant={'softlink'}
                                            flexWidth
                                            onClick={this.handleClick(link, index)}
                                        />
                                    </li>
                                );
                            })}
                        </ul>
                    </>
                )}
            </Box>
        );
    }
}

const styles = {
    largeTitle: {
        fontSize: ['md', 'lg'],
        fontWeight: 'bold'
    },
    title: {
        [VARIANTS.TILE]: {
            fontSize: ['md', 'lg'],
            fontWeight: 'bold'
        },
        [VARIANTS.CHUNKLET]: {
            fontSize: ['md', 'lg'],
            fontWeight: 'bold'
        },
        [VARIANTS.CARD]: {
            fontSize: ['md', 'lg'],
            fontWeight: 'bold'
        }
    },
    list: {
        display: 'grid',
        gap: GAP,
        [VARIANTS.CHUNKLET]: {
            gridTemplateColumns: 'repeat(2, 1fr)',
            gap: space[2],

            [mediaQueries.xsMax]: {
                '& > *': {
                    maxWidth: 192
                }
            },
            [mediaQueries.sm]: {
                display: 'grid',
                gridTemplateColumns: 'repeat(6, 1fr)'
            }
        },
        [VARIANTS.TILE]: {
            gridTemplateColumns: 'repeat(3, 1fr)',
            [mediaQueries.sm]: {
                display: 'flex',
                flexWrap: 'wrap'
            }
        },
        [VARIANTS.CARD]: {
            gap: space[2],
            gridTemplateColumns: `repeat(auto-fill, minmax(${DEFAULT_DIMENSIONS.LGUI.WIDTH}px, 1fr))`,
            picture: {
                width: '100%'
            },
            [mediaQueries.sm]: {
                gap: space[3],
                gridTemplateColumns: `repeat(auto-fill, ${DEFAULT_DIMENSIONS.LGUI.WIDTH}px)`
            }
        }
    },
    item: {
        display: 'flex',
        flexShrink: 0,
        wordBreak: 'break-word',
        '& > *': {
            width: '100%'
        }
    },
    tileItem: {
        [mediaQueries.sm]: {
            width: '117px'
        }
    },
    flexTitle: {
        display: 'block',
        [mediaQueries.sm]: {
            display: 'inline-block',
            flexGrow: 1,
            flexBasis: '15%',
            paddingRight: space[3]
        }
    },
    flexContainer: {
        display: 'block',
        justifyContent: 'space-between',
        [mediaQueries.sm]: {
            display: 'flex',
            flexWrap: 'wrap'
        }
    }
};

SoftLinks.propTypes = {
    context: PropTypes.oneOf([CONTEXTS.CONTAINER, CONTEXTS.MODAL]),
    sid: PropTypes.string,
    title: PropTypes.string,
    text: PropTypes.object,
    items: PropTypes.array,
    variant: PropTypes.oneOf(['chunklet', 'tile', 'card']),
    marginTop: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    marginBottom: PropTypes.oneOfType([PropTypes.array, PropTypes.number]),
    moreLinks: PropTypes.bool
};

SoftLinks.defaultProps = {
    context: CONTEXTS.CONTAINER,
    sid: null,
    title: null,
    text: null,
    items: null,
    variant: 'chunklet',
    marginTop: COMPONENT_SPACING.LG,
    marginBottom: COMPONENT_SPACING.LG,
    moreLinks: false
};

export default wrapComponent(SoftLinks, 'SoftLinks', true);
