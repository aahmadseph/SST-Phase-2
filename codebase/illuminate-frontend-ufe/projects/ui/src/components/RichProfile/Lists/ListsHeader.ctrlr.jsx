import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import { Box, Link } from 'components/ui';
import localeUtils from 'utils/LanguageLocale';

class ListsHeader extends BaseClass {
    constructor(props) {
        super(props);
    }
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/Lists/locales', 'ListsHeader');
        const { link, children, dataAt } = this.props;

        return (
            <Box position='relative'>
                <Box
                    data-at={dataAt}
                    fontSize={Sephora.isMobile() ? 'xl' : '2xl'}
                    lineHeight='none'
                    fontFamily='serif'
                    children={children}
                />
                {link && (
                    <Link
                        href={link}
                        paddingY={2}
                        marginY={-2}
                        arrowDirection='right'
                        children={getText('viewAll')}
                        css={{
                            position: 'absolute',
                            right: 0,
                            bottom: 0
                        }}
                    />
                )}
            </Box>
        );
    }
}

export default wrapComponent(ListsHeader, 'ListsHeader', true);
