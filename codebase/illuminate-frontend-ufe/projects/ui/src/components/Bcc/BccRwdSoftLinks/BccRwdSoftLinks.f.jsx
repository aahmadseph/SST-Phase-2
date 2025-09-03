import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    lineHeights, space, mediaQueries, modal
} from 'style/config';
import { Text } from 'components/ui';
import Chunklet from 'components/Chunklet';
import TileLink from 'components/TileLink';
import BccRwdLinkHOC from 'components/Bcc/BccRwdLinkHOC';
import Markdown from 'components/Markdown/Markdown';
import BCCUtils from 'utils/BCC';

const { CONTEXTS } = BCCUtils;

const BccRwdLinkChunklet = BccRwdLinkHOC(Chunklet);
const BccRwdLinkTile = BccRwdLinkHOC(TileLink);
const GAP = space[2];

function BccRwdSoftLinks({
    titleText, markdownText, componentList, context, enablePageRenderTracking, displayCount, variant
}) {
    /* eslint-disable no-param-reassign */
    variant = variant.toLowerCase();
    const isTile = variant === 'tile';
    const padItem = (
        <li
            css={[styles.pad, styles.pad[variant], styles.pad[variant][context]]}
            aria-hidden
        />
    );

    return (
        <div css={isTile && (titleText || markdownText) && styles.rootTile}>
            <div css={isTile && [styles.tileText, styles.tileText[context]]}>
                {titleText && (
                    <Text
                        is='h2'
                        lineHeight='tight'
                        {...(isTile
                            ? {
                                fontSize: ['md', 'lg'],
                                fontWeight: 'bold',
                                marginBottom: markdownText && '.25em'
                            }
                            : {
                                fontSize: 'sm',
                                marginBottom: 2,
                                color: 'gray'
                            })}
                        children={titleText}
                    />
                )}
                {isTile && markdownText && <Markdown content={markdownText} />}
            </div>
            <ul css={[styles.list, styles.list[variant], styles.list[variant][context]]}>
                {padItem}
                {componentList.map((link, index) => (
                    <li
                        key={link.name}
                        css={styles.item}
                    >
                        {isTile ? (
                            <BccRwdLinkTile
                                bccProps={link}
                                useInternalTracking={true}
                                children={link.titleText}
                                image={link.imageSource}
                                isPageRenderImg={enablePageRenderTracking && index < displayCount}
                            />
                        ) : (
                            <BccRwdLinkChunklet
                                bccProps={link}
                                useInternalTracking={true}
                                children={link.titleText}
                                image={link.imageSource}
                                isPageRenderImg={enablePageRenderTracking && index < displayCount}
                            />
                        )}
                    </li>
                ))}
                {padItem}
            </ul>
        </div>
    );
}

const SCROLL_STYLE = {
    overflowX: 'auto',
    scrollbarWidth: 'none',
    paddingTop: space[4],
    paddingBottom: space[4],
    marginTop: -space[4],
    marginBottom: -space[4],
    '&::-webkit-scrollbar': { display: 'none' }
};

const styles = {
    rootTile: {
        display: 'flex',
        flexDirection: 'column',
        gap: space[3],
        [mediaQueries.sm]: {
            gap: space[5],
            flexDirection: 'row',
            flexWrap: 'wrap',
            alignItems: 'flex-start'
        }
    },
    tileText: {
        lineHeight: lineHeights.tight,
        [CONTEXTS.CONTAINER]: {
            [mediaQueries.sm]: {
                flex: '1 0 288px'
            }
        }
    },
    list: {
        display: 'flex',
        gap: GAP,
        chunklet: {
            [mediaQueries.xsMax]: {
                ...SCROLL_STYLE,
                '& > *': {
                    maxWidth: 192
                }
            },
            [mediaQueries.sm]: {
                display: 'grid',
                gap: space[2],
                gridTemplateColumns: 'repeat(auto-fill, minmax(166px, 1fr))'
            },
            [CONTEXTS.CONTAINER]: {
                [mediaQueries.xsMax]: {
                    marginLeft: -space.container,
                    marginRight: -space.container
                }
            },
            [CONTEXTS.MODAL]: {
                [mediaQueries.xsMax]: {
                    marginLeft: -modal.paddingX[0],
                    marginRight: -modal.paddingX[0]
                }
            }
        },
        tile: {
            ...SCROLL_STYLE,
            [CONTEXTS.CONTAINER]: {
                marginLeft: -space.container,
                marginRight: -space.container
            },
            [CONTEXTS.MODAL]: {
                marginLeft: -modal.paddingX[0],
                marginRight: -modal.paddingX[0],
                [mediaQueries.sm]: {
                    marginLeft: -modal.paddingX[1],
                    marginRight: -modal.paddingX[1]
                }
            }
        }
    },
    item: {
        display: 'flex',
        flexShrink: 0,
        '& > *': {
            width: '100%'
        }
    },
    pad: {
        flexShrink: 0,
        width: '.02px',
        chunklet: {
            [mediaQueries.sm]: {
                display: 'none'
            }
        },
        tile: {
            [CONTEXTS.CONTAINER]: {
                [mediaQueries.sm]: {
                    width: space.container - GAP
                }
            },
            [CONTEXTS.MODAL]: {
                [mediaQueries.sm]: {
                    width: modal.paddingX[1] - GAP
                }
            }
        }
    }
};

BccRwdSoftLinks.defaultProps = {
    enablePageRenderTracking: false,
    variant: 'Chunklet'
};

export default wrapFunctionalComponent(BccRwdSoftLinks, 'BccRwdSoftLinks');
