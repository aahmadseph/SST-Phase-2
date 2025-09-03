import React from 'react';
import PropTypes from 'prop-types';
import { wrapFunctionalComponent } from 'utils/framework';
import LanguageLocaleUtils from 'utils/LanguageLocale';
import userUtils from 'utils/User';
import UiUtils from 'utils/UI';
import GreetingText from 'components/GreetingText';
import Avatar from 'components/Avatar';
import {
    Box, Button, Grid, Image, Link, Text
} from 'components/ui';
import { space } from 'style/config';
import { HEADER_VALUE } from 'constants/authentication';

const { isFrench } = LanguageLocaleUtils;
const { SKELETON_TEXT, SKELETON_ANIMATION } = UiUtils;

const AVATAR_SIZE = 32;

const fireLinkData = value => (digitalData.page.attributes.previousPageData.linkData = value);

function SignInBanner({
    user, showSignInModal, showRegisterModal, showBiRegisterModal, localization
}) {
    const showSkeleton = !user.isInitialized;
    const isAnonymous = !showSkeleton && userUtils.isAnonymous();
    const { beautyInsiderAccount, ccRewards } = user;
    const points = beautyInsiderAccount?.promotionPoints || 0;
    const status = userUtils.displayBiStatus(beautyInsiderAccount?.vibSegment);
    const ccRewardsAmount = userUtils.getRewardsAmount(ccRewards?.bankRewards);

    return (
        <Box
            lineHeight='tight'
            height={`${AVATAR_SIZE + space[3] * 2 + 1}px`}
            borderBottomWidth={1}
            borderColor='divider'
        >
            {isAnonymous ? (
                <Grid
                    columns='1fr auto'
                    alignItems='center'
                    height='inherit'
                    paddingX='container'
                    gap={4}
                >
                    <Text
                        is='p'
                        fontSize={isFrench() && 'sm'}
                    >
                        <strong>{localization.signInFree}</strong>
                        {' 🚚'}
                        <br />
                        <Text fontSize='sm'>
                            {localization.signInAccount}{' '}
                            <Link
                                onClick={() => {
                                    fireLinkData('homepage:create an account');
                                    showRegisterModal({ isOpen: true, openPostBiSignUpModal: true });
                                }}
                                padding={1}
                                margin={-1}
                                color='blue'
                                underline={true}
                                children={localization.signInAccountLink}
                            />
                        </Text>
                    </Text>
                    <Button
                        onClick={() => {
                            fireLinkData('homepage:sign in');
                            showSignInModal({ isOpen: true, extraParams: { headerValue: HEADER_VALUE.USER_CLICK } });
                        }}
                        variant='primary'
                        size='sm'
                        minWidth='8.5em'
                        children={localization.signInCTA}
                    />
                </Grid>
            ) : (
                <Grid
                    href='/profile/BeautyInsider'
                    columns='auto 1fr'
                    alignItems='center'
                    height='inherit'
                    paddingX='container'
                    gap={4}
                >
                    {showSkeleton ? (
                        <Box
                            size={AVATAR_SIZE}
                            borderRadius='full'
                            overflow='hidden'
                            css={SKELETON_ANIMATION}
                        />
                    ) : (
                        <Avatar size={AVATAR_SIZE} />
                    )}
                    <div>
                        <GreetingText
                            is='h2'
                            css={showSkeleton && SKELETON_TEXT}
                        />
                        <Text
                            is='p'
                            fontSize='sm'
                            style={showSkeleton ? { display: 'none' } : null}
                        >
                            {beautyInsiderAccount ? (
                                <>
                                    {!ccRewards?.bankRewards && `${localization.status} `}
                                    <Image
                                        disableLazyLoad={true}
                                        src={`/img/ufe/bi/logo-${status.toLowerCase()}.svg`}
                                        alt={status}
                                        height='.725em'
                                    />
                                    {ccRewards?.bankRewards ? ' • ' : ' '}
                                    {localization.points} <b>{points.toLocaleString()}</b> point{points !== 1 ? 's' : ''}
                                    {ccRewards?.bankRewards ? (
                                        <>
                                            {' '}
                                            • <b>${ccRewardsAmount}</b> {localization.ccRewards}
                                        </>
                                    ) : (
                                        '.'
                                    )}
                                </>
                            ) : (
                                <>
                                    <Link
                                        onClick={e => {
                                            e.preventDefault();
                                            showBiRegisterModal({ isOpen: true });
                                        }}
                                        color='blue'
                                        underline={true}
                                        padding={2}
                                        margin={-2}
                                        children={localization.join}
                                    />{' '}
                                    {localization.earn}
                                </>
                            )}
                        </Text>
                    </div>
                </Grid>
            )}
        </Box>
    );
}

SignInBanner.propTypes = {
    user: PropTypes.object.isRequired,
    showSignInModal: PropTypes.func.isRequired,
    showRegisterModal: PropTypes.func.isRequired,
    showBiRegisterModal: PropTypes.func.isRequired,
    localization: PropTypes.object.isRequired
};

export default wrapFunctionalComponent(SignInBanner, 'SignInBanner');
