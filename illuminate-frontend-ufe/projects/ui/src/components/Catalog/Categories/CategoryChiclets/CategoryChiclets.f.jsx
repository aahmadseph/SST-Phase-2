import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { space, mediaQueries } from 'style/config';

import Chiclet from 'components/Chiclet';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';

function CategoryChiclets({ categories, isGridView, setNextPageData, ...props }) {
    return (
        <ul
            css={isGridView ? styles.chicletGrid : styles.chicletScroll}
            {...props}
        >
            {categories.map(category => {
                const { targetUrl, displayName, recordCount } = category;

                return (
                    <li key={`categoryChicletItem_${displayName}`}>
                        <Chiclet
                            {...(isGridView && {
                                fontSize: ['sm', 'base'],
                                minHeight: null,
                                padding: '.625em',
                                width: '100%',
                                alignItems: 'flex-start'
                            })}
                            variant='shadow'
                            href={urlUtils.getLink(targetUrl)}
                            onClick={e => {
                                if (setNextPageData) {
                                    setNextPageData(displayName);
                                }

                                Location.navigateTo(e, targetUrl);
                            }}
                            children={`${displayName}${recordCount ? ` (${recordCount})` : ''}`}
                        />
                    </li>
                );
            })}
        </ul>
    );
}

const styles = {
    chicletScroll: {
        margin: `-${space[2]}px -${space.container}px`,
        padding: `${space[2]}px ${space.container}px`,
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
    chicletGrid: {
        display: 'grid',
        gap: space[2],
        gridTemplateColumns: 'repeat(auto-fill, minmax(167px, 1fr))',
        [mediaQueries.sm]: {
            gridTemplateColumns: 'repeat(auto-fill, minmax(199px, 1fr))'
        },
        li: {
            display: 'flex'
        }
    }
};

export default wrapFunctionalComponent(CategoryChiclets, 'CategoryChiclets');
