import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Link } from 'components/ui';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';

function generateRedirectUrl(pageLocation, newLocation) {
    const baseSearchLocation = pageLocation.replace(/&.*/, '');
    const urlToRedirect = urlUtils.addParam(baseSearchLocation, 'node', newLocation);

    return urlToRedirect;
}

function SearchCategoryList({ categories, setNextPageData, pageLocation, ...props }) {
    return (
        <Box
            is='ul'
            lineHeight='tight'
            marginTop='-.5em'
            marginBottom={5}
            {...props}
        >
            {categories.length > 0 &&
                categories.map(category => {
                    const {
                        isSelected, nodeValue, nodeStr, displayName, recordCount
                    } = category;
                    const targetUrl = generateRedirectUrl(pageLocation, nodeValue || nodeStr);

                    return (
                        <li key={`categoryListItem_${displayName}`}>
                            <Link
                                display='block'
                                paddingY='.5em'
                                fontWeight={isSelected && 'bold'}
                                href={targetUrl}
                                onClick={e => {
                                    setNextPageData(displayName);
                                    Location.navigateTo(e, targetUrl);
                                }}
                                children={`${displayName}${recordCount ? ` (${recordCount})` : ''}`}
                            />
                        </li>
                    );
                })}
        </Box>
    );
}

export default wrapFunctionalComponent(SearchCategoryList, 'SearchCategoryList');
