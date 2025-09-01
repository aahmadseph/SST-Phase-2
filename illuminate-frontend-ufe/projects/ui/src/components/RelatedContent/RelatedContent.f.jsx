import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Text, Link, Divider
} from 'components/ui';
import Location from 'utils/Location';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import UrlUtils from 'utils/Url';

const { getLocaleResourceFile } = LanguageLocaleUtils;
const { addInternalTracking } = UrlUtils;
const getText = getLocaleResourceFile('components/Catalog/locales', 'Catalog');

function RelatedContent({ links = [], hasDivider }) {
    return links.length > 0 ? (
        <>
            {hasDivider && (
                <Divider
                    marginTop={[5, 6]}
                    marginBottom={[5, 6]}
                />
            )}
            <Box marginTop={hasDivider || [5, 7]}>
                <Text
                    is='h2'
                    fontWeight='bold'
                    display='inline'
                    children={`${getText('relatedContent')}:`}
                />{' '}
                {links.map((link, index) => {
                    let url = new URL(link.url);
                    url = url.pathname + url.search;
                    url = addInternalTracking(url, [`related-pages:lem:${link.anchorText}`]);

                    return (
                        <React.Fragment key={`related_link_${url}`}>
                            <Link
                                display='inline'
                                href={url}
                                onClick={e => {
                                    Location.navigateTo(e, url);
                                }}
                                padding={1}
                                margin={-1}
                                children={link.anchorText}
                            />
                            {index < links.length - 1 && ', '}
                        </React.Fragment>
                    );
                })}
            </Box>
        </>
    ) : null;
}

export default wrapFunctionalComponent(RelatedContent, 'RelatedContent');
