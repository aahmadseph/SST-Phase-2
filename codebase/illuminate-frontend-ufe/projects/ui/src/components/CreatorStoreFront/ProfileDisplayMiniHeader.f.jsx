import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Divider, Flex, Image, Link, Text, Box
} from 'components/ui';
import { getProfileDisplaySelector } from 'selectors/creatorStoreFront/profileDisplaySelector';
import { useNavigateTo } from 'components/CreatorStoreFront/helpers/csfNavigation';
import { colors, radii } from 'style/config';

const ELEVATED = 'elevated';

function ProfileDisplayMiniHeader(props) {
    const { dispatch, handle } = props;

    const { navigateTo } = useNavigateTo(dispatch);
    const [isLoading, setIsLoading] = useState(true);
    const { creatorProfileData = {}, textResources } = useSelector(getProfileDisplaySelector);

    const { creatorProfile = {} } = creatorProfileData;
    const { firstName, profilePic, experience } = creatorProfile;

    useEffect(() => {
        if (Object.keys(creatorProfile).length !== 0 && isLoading) {
            setIsLoading(false);
        }
    }, [creatorProfile, isLoading]);

    const onGoToProfile = async event => {
        event.preventDefault();
        const path = `/creators/${handle}`;
        await navigateTo(path, false, true);
    };

    return (
        <div>
            <Divider marginX={'-50vw'} />

            <Flex
                paddingY={3}
                alignItems='center'
                justifyContent='space-between'
            >
                <Flex
                    gap={2}
                    alignItems='center'
                >
                    {isLoading ? (
                        <Box
                            width={24}
                            height={24}
                            borderRadius='full'
                            backgroundColor={colors.lightGray}
                        />
                    ) : (
                        <Image
                            width={24}
                            height={24}
                            css={profilePic ? styles.profileImageWithOutline : styles.profileImage}
                            src={profilePic || '/img/ufe/icons/me-active.svg'}
                            alt='Profile'
                            display='block'
                        />
                    )}

                    <Flex alignItems='center'>
                        {isLoading ? (
                            <>
                                <Box
                                    width='60px'
                                    height='14px'
                                    backgroundColor={colors.lightGray}
                                    borderRadius='md'
                                    marginRight={1}
                                />
                                <Box
                                    width='50px'
                                    height='14px'
                                    backgroundColor={colors.lightGray}
                                    borderRadius='md'
                                />
                            </>
                        ) : (
                            <>
                                <Text
                                    fontWeight='bold'
                                    children={`${textResources?.shopWith} `}
                                />
                                <Text
                                    fontWeight='bold'
                                    numberOfLines={1}
                                    css={styles.profileName}
                                    children={firstName}
                                />
                            </>
                        )}
                    </Flex>

                    {!isLoading && experience?.toLowerCase() === ELEVATED && <Image src='/img/ufe/csf/premium-tick.svg' />}
                </Flex>

                {isLoading ? (
                    <Box
                        width='80px'
                        height='14px'
                        backgroundColor={colors.lightGray}
                        borderRadius='md'
                    />
                ) : (
                    <Link
                        color={'blue'}
                        onClick={onGoToProfile}
                        children={textResources?.goToProfile}
                    />
                )}
            </Flex>

            <Divider marginX={'-50vw'} />

            <Text
                alignItems='center'
                justifyContent='space-between'
                is='p'
                color={colors.gray}
                fontSize={'sm'}
                marginY={[2, null, 3]}
                children={textResources?.commissionableLinks}
            />
        </div>
    );
}

const styles = {
    profileImage: {
        borderRadius: radii.full,
        objectFit: 'cover'
    },
    profileImageWithOutline: {
        borderRadius: radii.full,
        outline: `2px ${colors.white} solid`,
        objectFit: 'cover'
    },
    profileName: {
        maxWidth: '14ch',
        display: 'inline-block'
    }
};

export default wrapFunctionalComponent(ProfileDisplayMiniHeader, 'ProfileDisplayMiniHeader');
