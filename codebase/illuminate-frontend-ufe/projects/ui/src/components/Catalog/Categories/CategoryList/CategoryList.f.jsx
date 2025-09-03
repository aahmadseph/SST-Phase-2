import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Link } from 'components/ui';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';

function CategoryList({ categories, setNextPageData, ...props }) {
    return (
        <Box
            is='ul'
            lineHeight='tight'
            marginTop='-.5em'
            marginBottom={5}
            {...props}
        >
            {categories.map(category => {
                const { isSelected, targetUrl, displayName, recordCount } = category;

                return (
                    <li key={`categoryListItem_${displayName}`}>
                        <Link
                            display='block'
                            paddingY='.5em'
                            fontWeight={isSelected && 'bold'}
                            href={urlUtils.getLink(targetUrl)}
                            onClick={e => {
                                e.preventDefault();
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

export default wrapFunctionalComponent(CategoryList, 'CategoryList');
