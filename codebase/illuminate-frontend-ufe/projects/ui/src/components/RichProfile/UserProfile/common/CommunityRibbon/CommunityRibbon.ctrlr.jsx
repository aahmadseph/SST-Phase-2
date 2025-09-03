import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { fontSizes, mediaQueries } from 'style/config';
import { Box, Flex } from 'components/ui';
import userUtils from 'utils/User';
import communityUtils from 'utils/Community';
import localeUtils from 'utils/LanguageLocale';

const { getCommunityUrl, COMMUNITY_URLS } = communityUtils;

class CommunityRibbon extends BaseClass {
    render() {
        const getText = localeUtils.getLocaleResourceFile('components/RichProfile/UserProfile/common/CommunityRibbon/locales', 'CommunityRibbon');
        const {
            photoCount, groupCount, postCount, userSocialId, publicNickname, publicId
        } = this.props;

        const communityUrl = getCommunityUrl();

        const postsUrl = `${communityUrl}${COMMUNITY_URLS.CONVERSATIONS}${userSocialId}?isMyPost=true`;
        const groupsUrl = publicNickname
            ? `${communityUrl}${COMMUNITY_URLS.GROUPS}?username=${publicNickname}`
            : `${communityUrl}${COMMUNITY_URLS.GROUPS}?pageType=my-group`;
        const photosUrl = publicId ? `${COMMUNITY_URLS.NEW_PUBLIC_LOOKS_PROFILE}${publicId}` : COMMUNITY_URLS.NEW_MY_LOOKS_PROFILE;

        const itemDivider = (
            <div css={styles.divider}>
                <Box
                    marginX='auto'
                    width='1px'
                    backgroundColor='lightGray'
                    height='2.25em'
                />
            </div>
        );

        return (
            <Flex
                fontSize={['base', 'md']}
                alignItems='center'
                justifyContent='center'
                lineHeight='none'
                paddingX={2}
                paddingY='.875em'
            >
                <Flex
                    alignItems='center'
                    href={postCount > 0 && postsUrl}
                >
                    <img
                        src='/img/ufe/icons/chat.svg'
                        alt=''
                        css={styles.icon}
                    />

                    <div>
                        <div css={styles.count}>{userUtils.formatSocialCount(postCount)}</div>
                        <div css={styles.label}>{getText(postCount === 1 ? 'post' : 'posts')}</div>
                    </div>
                </Flex>

                {itemDivider}

                <Flex
                    alignItems='center'
                    href={groupCount > 0 && groupsUrl}
                >
                    <img
                        src='/img/ufe/icons/groups.svg'
                        alt=''
                        css={styles.icon}
                    />

                    <div>
                        <div css={styles.count}>{userUtils.formatSocialCount(groupCount)}</div>
                        <div css={styles.label}>{getText(groupCount === 1 ? 'group' : 'groups')}</div>
                    </div>
                </Flex>

                {itemDivider}

                <Flex
                    alignItems='center'
                    href={photoCount > 0 && photosUrl}
                >
                    <img
                        src='/img/ufe/icons/looks.svg'
                        alt=''
                        css={styles.icon}
                    />

                    <div>
                        <div css={styles.count}>{userUtils.formatSocialCount(photoCount)}</div>
                        <div css={styles.label}>{getText(photoCount === 1 ? 'photo' : 'photos')}</div>
                    </div>
                </Flex>

                {/*TODO: comment temporary Reviews section. Will be uncomment later after resolving issues with reviews*/}
                {/*{itemDivider}*/}

                {/*<Flex*/}
                {/*    alignItems='center'*/}
                {/*    href={reviewCount > 0 && reviewsUrl}*/}
                {/*>*/}
                {/*    <img*/}
                {/*        src='/img/ufe/icons/star-outline.svg'*/}
                {/*        alt=''*/}
                {/*        css={styles.icon}*/}
                {/*    />*/}

                {/*    <div>*/}
                {/*        <div css={styles.count}>{userUtils.formatSocialCount(reviewCount)}</div>*/}
                {/*        <div css={styles.label}>{getText(reviewCount === 1 ? 'review' : 'reviews')}</div>*/}
                {/*    </div>*/}
                {/*</Flex>*/}
            </Flex>
        );
    }
}

const styles = {
    divider: {
        flex: 1,
        textAlign: 'center',
        maxWidth: '2.5em'
    },
    icon: {
        width: '1.5em',
        height: '1.5em',
        marginRight: '.5em',
        [mediaQueries.sm]: {
            marginRight: '.75em'
        }
    },
    count: {
        fontWeight: 'var(--font-weight-bold)'
    },
    label: {
        fontSize: fontSizes.sm
    }
};

export default wrapComponent(CommunityRibbon, 'CommunityRibbon');
