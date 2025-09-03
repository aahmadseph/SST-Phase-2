import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import urlUtils from 'utils/Url';
import {
    Link, Divider, Text, Box
} from 'components/ui';

const { getLink } = urlUtils;

const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RelatedLinks/locales', 'RelatedLinks');

function RelatedLinks({ links = [], isExploreMore = false }) {
    if (links.length === 0) {
        return null;
    }

    return (
        <>
            {!isExploreMore && <Divider marginBottom={6} />}
            <Box
                marginTop={isExploreMore ? 4 : 0}
                data-at={Sephora.debug.dataAt('related_content_section')}
            >
                <Text
                    is='h2'
                    display='inline'
                    fontWeight='bold'
                    data-at={Sephora.debug.dataAt('related_pages')}
                    children={!isExploreMore ? `${getText('relatedContentLabel')}:` : `${getText('exploreMoreLabel')}:`}
                />{' '}
                <Text
                    is='ul'
                    display='inline'
                >
                    {links.map((link, index) => {
                        const targetUrl = getLink(link.related_page_url || link.url, ['seop_linkgroup']);

                        return (
                            <Text
                                is='li'
                                display='inline-block'
                                key={`relatedLink_${targetUrl}`}
                            >
                                <Link
                                    href={targetUrl}
                                    onClick={event => Location.navigateTo(event, targetUrl)}
                                    padding={1}
                                    margin={-1}
                                    children={link.name || link.anchorText}
                                />
                                {index < links.length - 1 && (
                                    <span
                                        aria-label='hidden'
                                        children=', '
                                    />
                                )}
                            </Text>
                        );
                    })}
                </Text>
            </Box>
        </>
    );
}

export default wrapFunctionalComponent(RelatedLinks, 'RelatedLinks');
