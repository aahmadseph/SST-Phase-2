import React from 'react';
import Location from 'utils/Location';
import Chiclet from 'components/Chiclet';
import Chunklet from 'components/Chunklet';
import FrameworkUtils from 'utils/framework';
import LanguageLocale from 'utils/LanguageLocale';
import { space, mediaQueries } from 'style/config';
import { Container, Text, Divider } from 'components/ui';

const { getLocaleResourceFile } = LanguageLocale;
const { wrapFunctionalComponent } = FrameworkUtils;
const getText = getLocaleResourceFile('components/Search/NullSearch/locales', 'NullSearch');

const MWTS = [
    {
        titleText: getText('new'),
        imageSource: '/contentimages/categorybanners/RWD/icons/new.svg',
        targetUrl: '/beauty/new-beauty-products'
    },
    {
        titleText: getText('bestsellers'),
        imageSource: '/contentimages/categorybanners/RWD/icons/bestsellers.svg',
        targetUrl: '/beauty/beauty-best-sellers'
    },
    {
        titleText: getText('valueGiftSets'),
        // update to `contentimages` version when available
        imageSource: '/img/ufe/fpo/mwts-icons/value-gift-sets.svg',
        targetUrl: '/shop/shop-travel-size-gifts-sets'
    },
    {
        titleText: getText('brands'),
        // update to `contentimages` version when available
        imageSource: '/img/ufe/fpo/mwts-icons/brands.svg',
        targetUrl: '/brands-list'
    },
    {
        titleText: getText('sephoraCollection'),
        imageSource: '/contentimages/categorybanners/RWD/icons/sephoracollection.svg',
        targetUrl: '/brand/sephora-collection'
    },
    {
        titleText: getText('miniSize'),
        imageSource: '/contentimages/categorybanners/RWD/icons/minis.svg',
        targetUrl: '/shop/travel-size-toiletries'
    },
    {
        titleText: getText('valueSize'),
        imageSource: '/contentimages/categorybanners/RWD/icons/value_size.svg',
        targetUrl: '/beauty/supersized-beauty-products'
    }
];

const CATEGORIES = [
    {
        titleText: getText('makeup'),
        targetUrl: '/shop/makeup-cosmetics'
    },
    {
        titleText: getText('skincare'),
        targetUrl: '/shop/skincare'
    },
    {
        titleText: getText('hair'),
        targetUrl: '/shop/hair-products'
    },
    {
        titleText: getText('toolsBrushes'),
        targetUrl: '/shop/makeup-tools'
    },
    {
        titleText: getText('fragrance'),
        targetUrl: '/shop/fragrance'
    },
    {
        titleText: getText('bathBody'),
        targetUrl: '/shop/bath-body'
    },
    {
        titleText: getText('gifts'),
        targetUrl: '/shop/gifts'
    },
    {
        titleText: getText('sale'),
        targetUrl: '/sale'
    }
];

const DIVIDER = (
    <Divider
        marginTop={[6, 7]}
        marginBottom={[3, 4]}
    />
);

function NullSearch(props) {
    const { catalog } = props;

    if (!catalog || (catalog && !catalog.errorMessages)) {
        return null;
    }

    const { errorMessages = [] } = catalog;

    return (
        <Container>
            {!!errorMessages[0] && (
                <Text
                    is='h1'
                    fontSize={['md', 'xl']}
                    fontWeight='bold'
                    lineHeight='tight'
                    marginTop='1em'
                    marginBottom='.25em'
                    dangerouslySetInnerHTML={{
                        __html: errorMessages[0] || '&nbsp;'
                    }}
                />
            )}
            {!!errorMessages[1] && (
                <Text
                    is='p'
                    fontSize={[null, 'lg']}
                    lineHeight='tight'
                    dangerouslySetInnerHTML={{
                        __html: errorMessages[1] || '&nbsp;'
                    }}
                />
            )}
            {DIVIDER}
            <Text
                is='h2'
                fontSize={['md', 'lg']}
                fontWeight='bold'
                marginBottom='1em'
                lineHeight='tight'
                children={getText('moreWaysToShop')}
            />
            <ul css={[styles.chunkletList, { [mediaQueries.sm]: styles.chunkletChicletGrid }]}>
                {MWTS.map(link => (
                    <li key={`mwtsChunklet_${link.targetUrl}`}>
                        <Chunklet
                            width='100%'
                            children={link.titleText}
                            image={link.imageSource}
                            href={link.targetUrl}
                            onClick={e => {
                                Location.navigateTo(e, link.targetUrl);
                            }}
                        />
                    </li>
                ))}
            </ul>
            {DIVIDER}
            <Text
                is='h2'
                fontSize={['md', 'lg']}
                fontWeight='bold'
                marginBottom='1em'
                lineHeight='tight'
                children={getText('shopByCategory')}
            />
            <ul css={styles.chunkletChicletGrid}>
                {CATEGORIES.map(category => (
                    <li key={`categoryChicletItem_${category.targetUrl}`}>
                        <Chiclet
                            fontSize={['sm', 'base']}
                            minHeight={null}
                            padding='.625em'
                            width='100%'
                            alignItems='flex-start'
                            variant='outline'
                            href={category.targetUrl}
                            onClick={e => {
                                Location.navigateTo(e, category.targetUrl);
                            }}
                            children={category.titleText}
                        />
                    </li>
                ))}
            </ul>
        </Container>
    );
}

const styles = {
    chunkletList: {
        [mediaQueries.xsMax]: {
            margin: `-${space[2]}px -${space.container}px`,
            padding: `${space[2]}px ${space.container}px`,
            fontSize: 0,
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            '& > li': {
                display: 'inline-block',
                '& + li': {
                    marginLeft: space[2]
                }
            }
        }
    },
    chunkletChicletGrid: {
        display: 'grid',
        gap: space[2],
        gridTemplateColumns: 'repeat(auto-fill, minmax(172px, 1fr))',
        '& > li': {
            display: 'flex'
        }
    }
};

export default wrapFunctionalComponent(NullSearch, 'NullSearch');
