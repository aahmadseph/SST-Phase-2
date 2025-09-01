import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    Text, Box, Link, Flex
} from 'components/ui';
import mediaUtils from 'utils/Media';

const { Media } = mediaUtils;

function ProfileCompletionStatus({
    beautyPreferencesTitle,
    checkRecommendationsLinkHeading,
    hasAnsweredAllPrefs,
    openPrivacySettings,
    profileCompletionStatusHeading,
    privacySettings,
    profileCompleteMessageHeading,
    profileCompletionPercentage,
    profileStatusMessage,
    showPrivacySettings
}) {
    return (
        <Box
            marginTop={[3, null, 5]}
            marginBottom={[4, null, 6]}
        >
            <div css={styles.profileCompletionStatusHeading}>
                <Flex width='100%'>
                    <Text
                        is='h1'
                        fontWeight='bold'
                        fontSize={['lg', null, 'xl']}
                        css={{
                            textTransform: 'capitalize',
                            flex: 1
                        }}
                        children={beautyPreferencesTitle}
                    />
                    {showPrivacySettings && (
                        <Media greaterThan='xs'>
                            <Link
                                color='blue'
                                onClick={openPrivacySettings}
                                children={privacySettings}
                            />
                        </Media>
                    )}
                </Flex>
                <Text
                    fontSize={[null, null, 'md']}
                    children={hasAnsweredAllPrefs ? profileCompleteMessageHeading : profileStatusMessage}
                >
                    {hasAnsweredAllPrefs ? (
                        <>
                            {profileCompleteMessageHeading}{' '}
                            <Link
                                href='#personalized-picks'
                                color='blue'
                                children={checkRecommendationsLinkHeading}
                            />
                        </>
                    ) : (
                        profileStatusMessage
                    )}
                </Text>
            </div>
            {!hasAnsweredAllPrefs && (
                <Box
                    css={styles.profileCompletionStatusContent}
                    marginTop={[3, null, 6]}
                >
                    <Text
                        is='p'
                        fontWeight='bold'
                        fontSize={['sm', null, 'md']}
                        children={profileCompletionStatusHeading}
                    />
                    <Box
                        width={[130, 400]}
                        height={[9, 12]}
                        backgroundColor='lightGray'
                        borderRadius='full'
                        marginX='auto'
                        marginTop={2}
                    >
                        <Box
                            backgroundColor='green'
                            borderRadius='full'
                            height='100%'
                            style={{ width: `${profileCompletionPercentage}%` }}
                        />
                    </Box>
                </Box>
            )}
        </Box>
    );
}

const styles = {
    profileCompletionStatusHeading: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'start'
    },
    profileCompletionStatusContent: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    }
};

ProfileCompletionStatus.propTypes = {
    profileCompletionPercentage: PropTypes.number.isRequired
};

export default wrapFunctionalComponent(ProfileCompletionStatus, 'ProfileCompletionStatus');
