import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { space } from 'style/config';
import Chiclet from 'components/Chiclet';
import urlUtils from 'utils/Url';
import Location from 'utils/Location';

function generateRedirectUrl(pageLocation, newLocation) {
    let baseSearchLocation = urlUtils.removeParam(pageLocation, 'node');
    baseSearchLocation = urlUtils.removeParam(baseSearchLocation, 'ref');
    baseSearchLocation = urlUtils.removeParam(baseSearchLocation, 'pl');
    baseSearchLocation = urlUtils.removeParam(baseSearchLocation, 'ph');
    baseSearchLocation = urlUtils.removeParam(baseSearchLocation, 'ptype');
    baseSearchLocation = urlUtils.removeParam(baseSearchLocation, 'sortBy');
    const urlToRedirect = urlUtils.addParam(baseSearchLocation, 'node', newLocation);

    return urlToRedirect;
}

const SearchChiclets = React.forwardRef(({ categories, setNextPageData, pageLocation, ...props }, ref) => {
    return (
        <ul
            ref={ref}
            css={styles.list}
            {...props}
        >
            {categories.map(category => {
                const { nodeValue, nodeStr, displayName, recordCount } = category;
                const targetUrl = generateRedirectUrl(pageLocation, nodeValue || nodeStr);

                return (
                    <li key={`categoryChicletItem_${displayName}`}>
                        <Chiclet
                            variant='shadow'
                            href={targetUrl}
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
});

const styles = {
    list: {
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
    }
};

export default wrapFunctionalComponent(SearchChiclets, 'SearchChiclets');
