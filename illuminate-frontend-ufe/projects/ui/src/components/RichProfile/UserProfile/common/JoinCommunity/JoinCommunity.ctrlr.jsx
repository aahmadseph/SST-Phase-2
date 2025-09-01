/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Image, Text, Button, Link
} from 'components/ui';
import SectionContainer from 'components/RichProfile/UserProfile/common/SectionContainer/SectionContainer';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';

const { socialCheckLink, getCommunityUrl, COMMUNITY_URLS, PROVIDER_TYPES } = communityUtils;
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/common/JoinCommunity/locales', 'JoinCommunity');

class JoinCommunity extends BaseClass {
    render() {
        return (
            <SectionContainer>
                <Box
                    data-at={Sephora.debug.dataAt('beauty_insider_community_block')}
                    fontSize={Sephora.isMobile() ? 'base' : 'md'}
                    padding={Sephora.isMobile() ? 5 : 6}
                    textAlign='center'
                    border={1}
                    borderColor='midGray'
                    borderRadius={2}
                >
                    <Image
                        display='block'
                        marginX='auto'
                        src='/img/ufe/bi/logo-bi-community.svg'
                        width='20em'
                        marginBottom='1em'
                        alt={getText('beautyInsiderCommunity')}
                    />
                    <Text
                        is='p'
                        marginX='auto'
                        maxWidth='26em'
                    >
                        {getText('beautyInsiderDescription')}
                    </Text>
                    <Box
                        marginX='auto'
                        marginY='1.5em'
                        maxWidth='16em'
                    >
                        <Button
                            variant='primary'
                            block={true}
                            onClick={() => socialCheckLink(getCommunityUrl() + COMMUNITY_URLS.FORUM, PROVIDER_TYPES.bv)}
                        >
                            {getText('startNow')}
                        </Button>
                    </Box>
                    <Link
                        padding={3}
                        margin={-3}
                        arrowDirection='right'
                        href='/community'
                    >
                        {getText('exploreThecommunity')}
                    </Link>
                </Box>
            </SectionContainer>
        );
    }
}

export default wrapComponent(JoinCommunity, 'JoinCommunity');
