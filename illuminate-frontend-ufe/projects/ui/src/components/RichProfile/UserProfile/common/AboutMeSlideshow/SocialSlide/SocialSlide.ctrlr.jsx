/* eslint max-len: [2, 275] */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { colors, space } from 'style/config';
import {
    Box, Flex, Text, Link
} from 'components/ui';
import IconInstagram from 'components/LegacyIcon/IconInstagram';
import IconYoutube from 'components/LegacyIcon/IconYoutube';
import IconShare from 'components/LegacyIcon/IconShare';
import localeUtils from 'utils/LanguageLocale';
import Actions from 'actions/Actions';
import store from 'Store';

const { showShareLinkModal } = Actions;

class SocialSlide extends BaseClass {
    launchSocialShareModal = () => {
        const shareUrl = `${window.location.origin}/users/${this.props.nickname}`;
        store.dispatch(showShareLinkModal(true, `${this.props.nickname}'s Profile`, shareUrl));
    };

    render() {
        const getText = localeUtils.getLocaleResourceFile(
            'components/RichProfile/UserProfile/common/AboutMeSlideshow/SocialSlide/locales',
            'SocialSlide'
        );
        const {
            nickname, instagramUrl, youtubeUrl, biography, isMyProfile
        } = this.props;

        const privateBioEmptyMessage = getText('bioEmptyMessage');
        const privateFullEmptyMessage = getText('fullEmptyMessage');
        const publicEmptyMessage = nickname + ' ' + getText('emptyMessage');

        const isMobile = Sephora.isMobile();

        const styles = {
            socialIcon: {
                padding: isMobile ? 6 : 8,
                fontSize: isMobile ? 18 : 20,
                marginRight: space[2],
                borderRadius: 99999,
                lineHeight: 0,
                color: colors.white,
                backgroundColor: colors.black
            }
        };

        return (
            <Flex
                css={styles.root}
                fontSize={isMobile ? 'base' : 'md'}
                paddingY={isMobile ? 4 : 6}
                paddingX={isMobile ? 5 : 6}
                height='100%'
            >
                {biography || youtubeUrl || instagramUrl ? (
                    <Flex
                        flexDirection='column'
                        justifyContent='space-between'
                        width='100%'
                        lineHeight={isMobile ? 'tight' : null}
                    >
                        {biography ? (
                            <Text is='p'>{biography}</Text>
                        ) : (
                            <Text
                                is='p'
                                color='gray'
                            >
                                {isMyProfile ? privateBioEmptyMessage : publicEmptyMessage}
                            </Text>
                        )}
                        <Flex
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            <div>
                                {youtubeUrl && (
                                    <Link href={youtubeUrl}>
                                        <Box css={styles.socialIcon}>
                                            <IconYoutube />
                                        </Box>
                                    </Link>
                                )}
                                {instagramUrl && (
                                    <Link href={instagramUrl}>
                                        <Box css={styles.socialIcon}>
                                            <IconInstagram />
                                        </Box>
                                    </Link>
                                )}
                            </div>

                            {nickname && (
                                <Link onClick={this.launchSocialShareModal}>
                                    <IconShare fontSize='1.25em' />
                                    <Text marginLeft={2}>/{nickname}</Text>
                                </Link>
                            )}
                        </Flex>
                    </Flex>
                ) : (
                    <Flex
                        flexDirection='column'
                        justifyContent='space-between'
                        width='100%'
                        lineHeight={isMobile ? 'tight' : null}
                    >
                        <Text
                            is='p'
                            color='gray'
                        >
                            {isMyProfile ? privateFullEmptyMessage : publicEmptyMessage}
                        </Text>
                        <Flex
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            {nickname && (
                                <Link onClick={this.launchSocialShareModal}>
                                    <IconShare fontSize='1.25em' />
                                    <Text marginLeft={2}>/{nickname}</Text>
                                </Link>
                            )}
                        </Flex>
                    </Flex>
                )}
            </Flex>
        );
    }
}

export default wrapComponent(SocialSlide, 'SocialSlide');
