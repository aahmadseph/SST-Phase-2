/* eslint-disable camelcase */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Flex, Text, Link } from 'components/ui';
import UrlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';
import SectionDivider from 'components/SectionDivider/SectionDivider';

const { getLink } = UrlUtils;

class RelatedLinks extends BaseClass {
    constructor(props) {
        super(props);
    }

    convertLemLinks = links => {
        /*
        LEM format:
        'links': [
            0: {
              "url": "/buy/natural-hair-styling-products",
              "anchorText": "Natural Hair Styling Products"
            }, ...
        ]
        */
        return links.map(link => ({
            related_page_url: getLink(link.url, ['related-pages', 'lem', link.anchorText.toLocaleLowerCase()]),
            related_page_name: link.anchorText
        }));
    };

    render() {
        const { lemDataSource, links } = this.props;
        const noLinksToRender = !(links && links.length);

        if (noLinksToRender) {
            return null;
        }

        const isMobile = Sephora.isMobile();
        const getText = localeUtils.getLocaleResourceFile('components/RelatedLinks/locales', 'RelatedLinks');
        const relatedLinks = (lemDataSource ? this.convertLemLinks(links) : links).map(item => (
            <Link
                color='gray'
                display='block'
                href={item.related_page_url}
                key={item.related_page_url}
                lineHeight='tight'
                paddingX={!isMobile ? 3 : null}
                paddingY={1}
                width={!isMobile ? 1 / 3 : null}
            >
                {item.related_page_name}
            </Link>
        ));

        return (
            <React.Fragment>
                <SectionDivider />
                <Text
                    is='h2'
                    fontFamily='serif'
                    fontSize='xl'
                    marginBottom={4}
                    textAlign={!isMobile ? 'center' : null}
                    data-at={Sephora.debug.dataAt('related_pages')}
                >
                    {getText('relatedLinksLabel')}
                </Text>
                {isMobile ? (
                    relatedLinks
                ) : (
                    <Flex
                        flexWrap='wrap'
                        maxWidth='75%'
                        marginX='auto'
                        textAlign='center'
                    >
                        {relatedLinks}
                    </Flex>
                )}
            </React.Fragment>
        );
    }
}

export default wrapComponent(RelatedLinks, 'RelatedLinks');
