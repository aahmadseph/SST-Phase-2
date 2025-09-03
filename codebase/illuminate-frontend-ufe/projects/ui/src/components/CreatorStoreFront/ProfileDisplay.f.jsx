import React from 'react';
import { useSelector } from 'react-redux';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Box, Flex, Image, Text
} from 'components/ui';
import {
    colors, space, mediaQueries, radii, site
} from 'style/config';
import ShareButton from 'components/CreatorStoreFront/ShareButton/ShareButton';
import { getProfileDisplaySelector } from 'selectors/creatorStoreFront/profileDisplaySelector';
import mediaUtils from 'utils/Media';

const { isMobileView } = mediaUtils;
const ELEVATED = 'elevated';

function ProfileDisplay({ pathName }) {
    // Create selector instance once per render
    const { creatorProfileData = {}, textResources } = useSelector(getProfileDisplaySelector);
    const { creatorProfile = {} } = creatorProfileData;
    const {
        firstName, lastName, profilePic, profileBio, experience
    } = creatorProfile;

    const bannerSource = `/img/ufe/csf/${isMobileView() ? 'profile-header-background-mobile' : 'profile-header-background'}.svg`;
    const profilePicSource = profilePic || '/img/ufe/icons/me-active.svg';
    const profilePicStyle = profilePic ? styles.profileImageWithOutline : styles.profileImage;
    const isVerified = experience?.toLowerCase() === ELEVATED;

    return (
        <div>
            <Box
                position={'relative'}
                overflow={'hidden'}
                width={'100%'}
                maxWidth={site.containerMax + space.container * 2}
                marginX={'auto'}
                paddingX={'container'}
            >
                <Image
                    css={styles.gradientBarImage}
                    src={bannerSource}
                    alt='Background Top Banner'
                />

                {/* First Section */}
                <Flex
                    justifyContent={'space-between'}
                    alignItems={'center'}
                    width={'100%'}
                    position={'relative'}
                >
                    {/* Profile Info */}
                    <div css={styles.profileContainer}>
                        <Image
                            size={[60, null, 90]}
                            css={profilePicStyle}
                            src={profilePicSource}
                            alt='Profile'
                            display='block'
                        />
                        <Flex
                            justifyContent={'space-between'}
                            alignItems={'center'}
                            marginY={2}
                        >
                            <Flex
                                alignItems={'center'}
                                gap={2}
                            >
                                <Text
                                    is='h2'
                                    fontSize='md'
                                    fontWeight='bold'
                                    lineHeight='20px'
                                    wordWrap='break-word'
                                >
                                    {firstName} {lastName}
                                </Text>
                                {isVerified && (
                                    <Image
                                        size={20}
                                        src='/img/ufe/csf/premium-tick.svg'
                                    />
                                )}
                            </Flex>
                            <ShareButton
                                textResources={textResources}
                                pathName={pathName}
                            />
                        </Flex>
                        <Text
                            is='p'
                            fontSize={['sm', null, 'md']}
                            lineHeight={['14px', null, '20px']}
                            children={profileBio}
                        />
                        <Text
                            is='p'
                            color={colors.gray}
                            lineHeight={'14px'}
                            fontSize={'sm'}
                            marginTop={2}
                            children={textResources?.commissionableLinks}
                        />
                    </div>
                </Flex>
            </Box>
        </div>
    );
}

const styles = {
    gradientBarImage: {
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '60px',
        objectFit: 'cover',
        [mediaQueries.lg]: {
            height: '90px'
        }
    },
    logoImage: {
        width: '10rem',
        position: 'absolute',
        top: 0,
        right: 0,
        flexShrink: 0,
        [mediaQueries.lg]: {
            top: space[3]
        }
    },
    profileContainer: {
        flex: 1,
        paddingTop: space[4],
        paddingBottom: space[2],
        zIndex: 1,
        [mediaQueries.lg]: {
            paddingTop: '50px'
        }
    },
    profileImage: {
        borderRadius: radii.full,
        marginLeft: space[2],
        objectFit: 'cover',
        [mediaQueries.lg]: {
            marginLeft: 0
        }
    },
    profileImageWithOutline: {
        borderRadius: radii.full,
        outline: `2px ${colors.white} solid`,
        marginLeft: space[2],
        objectFit: 'cover',
        [mediaQueries.lg]: {
            marginLeft: 0
        }
    }
};

export default wrapFunctionalComponent(ProfileDisplay, 'ProfileDisplay');
