/* eslint-disable max-len */
import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { Box, Flex, Text } from 'components/ui';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import IconLock from 'components/LegacyIcon/IconLock';
import anaConsts from 'analytics/constants';
import localeUtils from 'utils/LanguageLocale';

const PrivateProfile = () => {
    const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/PrivateProfile/locales', 'PrivateProfile');
    const isMobile = Sephora.isMobile();
    const avatarSize = isMobile ? 92 : 172;
    const avatarOffset = isMobile ? avatarSize * 0.4 : avatarSize / 2;
    const shadow = '0 0 12px 0 rgba(150,150,150,0.25)';

    //Analytics
    digitalData.page.pageInfo.pageName = anaConsts.PAGE_NAMES.USER_PROFILE + '-private';

    return (
        <LegacyContainer
            paddingTop={isMobile ? 3 : 5}
            textAlign='center'
        >
            <Box
                fontSize={avatarSize}
                marginBottom={-avatarOffset}
            >
                <Flex
                    position='relative'
                    alignItems='center'
                    justifyContent='center'
                    borderRadius='full'
                    data-at={Sephora.debug.dataAt('user_avatar_private')}
                    border='4px solid'
                    backgroundColor='nearWhite'
                    borderColor='white'
                    width='1em'
                    height='1em'
                    marginX='auto'
                    boxShadow={shadow}
                >
                    <IconLock
                        fontSize='.375em'
                        color='gray'
                    />
                </Flex>
            </Box>
            <Box
                width='100%'
                maxWidth={665}
                paddingY={avatarOffset}
                marginX='auto'
                backgroundColor='white'
                boxShadow={shadow}
            >
                <Text
                    is='h1'
                    fontSize={isMobile ? 'lg' : '2xl'}
                    marginTop='.5em'
                    marginBottom='1em'
                    fontWeight='bold'
                >
                    {getText('privateProfile')}
                </Text>
            </Box>
        </LegacyContainer>
    );
};

export default wrapFunctionalComponent(PrivateProfile, 'PrivateProfile');
