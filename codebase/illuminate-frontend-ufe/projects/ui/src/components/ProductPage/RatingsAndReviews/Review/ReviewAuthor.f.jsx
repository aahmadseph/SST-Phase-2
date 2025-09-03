import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import {
    colors, radii, mediaQueries, space
} from 'style/config';
import {
    Grid, Flex, Box, Text, Image, Link
} from 'components/ui';
import biUtils from 'utils/BiProfile';
import lithiumApi from 'services/api/thirdparty/Lithium';
import localeUtils from 'utils/LanguageLocale';
const getText = localeUtils.getLocaleResourceFile('components/ProductPage/RatingsAndReviews/Review/locales', 'Review');
import IncentivizedBadge from 'components/ProductPage/IncentivizedBadge/IncentivizedBadge';

const RICH_PROFILE_URL = '/users/';

function renderBadges({ badges, isSmallView, isModal }) {
    // For highlighted reviews, we don't have badges
    if (!badges) {
        return null;
    }

    return (
        <Flex
            flexWrap='wrap'
            fontSize='xs'
            lineHeight='tight'
            flexDirection={!isSmallView && !isModal && 'column'}
            css={isModal ? styles.modalBadges : styles.reviewBadges}
        >
            {(badges.StaffContextBadge || badges.staffContextBadge) && (
                <span
                    css={styles.badge}
                    children={getText('sephoraEmployee')}
                />
            )}
            {(badges.IncentivizedReviewBadge || badges.incentivizedReview) && !isModal && (
                <span>
                    <IncentivizedBadge />
                </span>
            )}
        </Flex>
    );
}

function ReviewAuthor(props) {
    const {
        userNickname, biTraits, isSmallView, isModal, badges
    } = props;

    const getSocialInfo = () => {
        const { additionalFields = {} } = props;
        const socialInfo = {};

        const socialField =
            additionalFields.socialLockUp && additionalFields.socialLockUp.value ? additionalFields.socialLockUp.value.split('|') : '';

        // We are creating an object of social info from the string delimited by pipe character from BV.
        for (var prop in socialField) {
            if (hasOwnProperty.call(socialField, prop)) {
                const socialprop = socialField[prop];
                const key = socialprop.substring(0, socialprop.indexOf('='));
                const value = socialprop.substring(socialprop.indexOf('=') + 1);
                socialInfo[key] = value;
            }
        }

        if (!socialInfo.avatar) {
            socialInfo.avatar = lithiumApi.AVATAR_PHOTO_DEFAULT;
        }

        return socialInfo;
    };

    const socialData = getSocialInfo();

    const traits = biUtils.formatBeautyTraits(biTraits);

    return (
        <Grid
            fontSize={isModal && 'sm'}
            {...(isSmallView
                ? {
                    display: 'block',
                    fontSize: 'sm',
                    gap: null
                }
                : {
                    columns: 'auto 1fr',
                    gap: 3,
                    lineHeight: 'tight'
                })}
        >
            {isSmallView || (
                <Box href={userNickname && `${RICH_PROFILE_URL}${userNickname}`}>
                    <Image
                        data-at={Sephora.debug.dataAt('avatar')}
                        src={socialData.avatar}
                        size={32}
                        borderRadius='full'
                        css={{ objectFit: 'cover' }}
                    />
                </Box>
            )}
            <Box
                display={isSmallView || 'flex'}
                flexDirection='column'
                alignSelf='center'
            >
                {userNickname && (
                    <Link
                        fontWeight='bold'
                        href={`${RICH_PROFILE_URL}${userNickname}`}
                        data-at={Sephora.debug.dataAt('nickname')}
                        children={userNickname}
                    />
                )}
                {traits && (
                    <React.Fragment>
                        {isSmallView && userNickname && (
                            <span
                                children='•'
                                css={{ margin: '0 .5em' }}
                            />
                        )}
                        <Text
                            marginTop={isSmallView || '.125em'}
                            children={traits}
                        />
                    </React.Fragment>
                )}
                {(userNickname || traits) && isSmallView && (
                    <span
                        css={{
                            ':not(:last-child)': {
                                marginRight: space[2]
                            }
                        }}
                    />
                )}
                {renderBadges({ badges, isSmallView, isModal })}
            </Box>
        </Grid>
    );
}

const styles = {
    badge: {
        display: 'inline-block',
        padding: '3px 6px',
        backgroundColor: colors.lightBlue,
        borderRadius: radii[2],
        maxWidth: '100%'
    },
    reviewBadges: {
        [mediaQueries.smMax]: {
            '> *:not(:last-child)': {
                marginRight: '.5em'
            }
        },
        [mediaQueries.md]: {
            '> *': {
                marginRight: 'auto',
                marginTop: space[2]
            }
        }
    },
    modalBadges: {
        marginTop: '.25em',
        '> *:not(:last-child)': {
            marginRight: '.5em'
        }
    }
};

export default wrapFunctionalComponent(ReviewAuthor, 'ReviewAuthor');
