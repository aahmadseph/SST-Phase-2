import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { space, mediaQueries } from 'style/config';
import { Text, Divider } from 'components/ui';
import Chunklet from 'components/Chunklet';
import Chiclet from 'components/Chiclet';
import BccRwdLinkHOC from 'components/Bcc/BccRwdLinkHOC';
const BccRwdLinkChunklet = BccRwdLinkHOC(Chunklet);
import Action from 'components/Content/Action';
const ActionChunklet = Action(Chunklet);
const ActionChiclet = Action(Chiclet);

import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/Catalog/locales', 'Catalog');

const VARIANTS = {
    tile: ActionChunklet,
    chunklet: ActionChiclet
};

function SoftLinks({
    links = [], isBottom, title, listStyle = 'default', variant = 'tile'
}) {
    const ActionComponent = VARIANTS[variant];

    // get unique links
    const uniqueLinks = links.filter((link, index, self) => self.findIndex(l => l.sid === link.sid) === index);

    return links.length > 0 ? (
        <>
            {(isBottom || title) && (
                <Text
                    is='h2'
                    fontSize={['lg', 'xl']}
                    lineHeight='tight'
                    marginTop='.5em'
                    marginBottom='.75em'
                    fontWeight='bold'
                    children={title || getText('featuredContent')}
                />
            )}
            <ul css={styles.list[listStyle]}>
                {uniqueLinks.map(link => (
                    <li
                        key={`softlinks_${link.action?.sid}`}
                        css={styles.item}
                    >
                        {link.action ? (
                            <ActionComponent
                                sid={link.sid}
                                action={link.action}
                                children={link.label}
                                media={link.media}
                                {...(variant === 'chunklet' && {
                                    fontSize: ['sm', 'base'],
                                    minHeight: null,
                                    padding: '.625em',
                                    width: '100%',
                                    alignItems: 'flex-start',
                                    isLarge: true,
                                    variant: 'shadow'
                                })}
                            />
                        ) : (
                            <BccRwdLinkChunklet
                                bccProps={link}
                                children={link.titleText}
                                image={link.imageSource}
                                useInternalTracking={true}
                            />
                        )}
                    </li>
                ))}
            </ul>
            {isBottom && (
                <Divider
                    marginTop={[5, 7]}
                    marginBottom={4}
                />
            )}
        </>
    ) : null;
}

const styles = {
    list: {
        default: {
            [mediaQueries.smMax]: {
                margin: `-${space[2]}px -${space.container}px`,
                padding: `${space[2]}px ${space.container}px`,
                order: -1,
                fontSize: 0,
                whiteSpace: 'nowrap',
                overflowX: 'auto',
                scrollbarWidth: 'none',
                '&::-webkit-scrollbar': { display: 'none' },
                li: {
                    display: 'inline-block',
                    '+ li': {
                        marginLeft: space[2]
                    }
                }
            },
            [mediaQueries.md]: {
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(170px, 1fr))',
                gap: space[2],
                marginBottom: space[5]
            }
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
            gap: space[2],
            marginBottom: space[5]
        }
    },
    item: {
        display: 'flex',
        '& > *': {
            width: '100%'
        }
    }
};

export default wrapFunctionalComponent(SoftLinks, 'SoftLinks');
