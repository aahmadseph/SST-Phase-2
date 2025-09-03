import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Image, Box, Container } from 'components/ui';
import urlUtils from 'utils/Url';
import anaUtils from 'analytics/utils';
import { colors, borders } from 'style/config';
const { getLink } = urlUtils;

function Header() {
    return (
        <Box
            borderBottom={`${borders[1]} ${colors.lightGray}`}
            height={['54px', '54px', '96px']}
            alignContent='center'
        >
            <Container px={[null, 5, 4]}>
                <a
                    href={getLink('/')}
                    onClick={() =>
                        anaUtils.setNextPageData({
                            navigationInfo: anaUtils.buildNavPath(['top nav', 'sephora icon'])
                        })
                    }
                    css={{ display: 'block' }}
                >
                    <Image
                        display='block'
                        alt='Sephora'
                        src='/img/ufe/sephora.svg'
                        disableLazyLoad={true}
                        width={[87, 87, 147]}
                        height={[11, 11, 20]}
                        data-at={Sephora.debug.dataAt('sephora_logo_ref')}
                    />
                </a>
            </Container>
        </Box>
    );
}

export default wrapFunctionalComponent(Header, 'Header');
