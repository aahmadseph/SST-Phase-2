/* eslint-disable class-methods-use-this */

import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';

import {
    Box, Flex, Text, Link, Image
} from 'components/ui';
import mediaUtils from 'utils/Media';
import urlUtils from 'utils/Url';
import userUtils from 'utils/User';
import Location from 'utils/Location';
import uiUtils from 'utils/UI';
import GalleryCommunityUser from 'components/Community/GalleryCommunityUser';

const { SKELETON_TEXT } = uiUtils;
const { getLink } = urlUtils;
const { Media } = mediaUtils;

const UsersGalleryTopSection = ({
    locale, isUserPublicGallery, user, showSkeleton, contentCount
}) => {
    const isUserSignIn = userUtils.isSignedIn();

    const galleryCommunityUser = (isUserPublicGallery || isUserSignIn) && (
        <GalleryCommunityUser
            inUserGallery={true}
            user={user}
            userNickname={user.nickName}
        />
    );

    const userGalleryCount = (
        <Flex
            flexDirection='row'
            gap={1}
            justifyContent='flex-start'
            alignItems='center'
        >
            <Image src='/img/ufe/gallery/upload.svg' />
            <Text fontWeight='bold'>{contentCount}</Text> {locale.uploadedGalleryCount}
        </Flex>
    );

    return (
        <Flex
            width='100%'
            flexDirection='column'
            py={[5, 6]}
        >
            <Flex
                justifyContent='space-between'
                paddingX={2}
                alignItems='center'
            >
                <Flex
                    flexDirection='row'
                    justifyContent='flex-start'
                    gap={6}
                    alignItems='center'
                >
                    <Text
                        is='h2'
                        fontWeight='bold'
                        fontSize={['lg', 'xl']}
                        lineHeight={['normal', '26px']}
                        css={showSkeleton && SKELETON_TEXT}
                    >
                        {isUserPublicGallery ? `${user.nickName}'s ${locale.gallery}` : locale.title}
                    </Text>
                    <Media greaterThan='xs'>
                        <Flex
                            flexDirection='row'
                            gap={6}
                            alignItems='center'
                        >
                            <Box
                                borderLeft='solid #888 1px'
                                height='44px'
                                width='1px'
                            />
                            {galleryCommunityUser}
                            {userGalleryCount}
                        </Flex>
                    </Media>
                </Flex>

                <Link
                    color='blue'
                    onClick={e => Location.navigateTo(e, getLink('/community/gallery'))}
                >
                    {locale.titleCTA}
                </Link>
            </Flex>
            <Media lessThan='sm'>
                <Flex
                    flexDirection='column'
                    px={2}
                    pt={3}
                    gap={4}
                >
                    {galleryCommunityUser}
                    {userGalleryCount}
                </Flex>
            </Media>
        </Flex>
    );
};

export default wrapFunctionalComponent(UsersGalleryTopSection, 'UsersGalleryTopSection');
