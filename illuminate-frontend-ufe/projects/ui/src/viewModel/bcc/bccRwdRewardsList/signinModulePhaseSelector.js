import React from 'react';
import { createStructuredSelector, createSelector } from 'reselect';

import { Link, Box } from 'components/ui';

import basketSelector from 'selectors/basket/basketSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import anaUtils from 'analytics/utils';

import LanguageLocaleUtils from 'utils/LanguageLocale';
import BCCUtils from 'utils/BCC';

const { RWD_REWARDS_LIST_MINIMUM_POINTS } = BCCUtils;
const { getTextFromResource, getLocaleResourceFile } = LanguageLocaleUtils;
const getText = getLocaleResourceFile('components/Bcc/BccRwdRewardsList/locales', 'BccRwdRewardsList');

function rewardBazaarClickHandler(event) {
    event.preventDefault();
    const linkData = 'reward bazaar:beauty insider';
    anaUtils.setNextPageDataAndRedirect(event, {
        trackingData: {
            linkData: linkData,
            internalCampaign: linkData
        },
        destination: '/profile/BeautyInsider'
    });
}

export default createSelector(
    coreUserDataSelector,
    basketSelector,
    createStructuredSelector({
        points: getTextFromResource(getText, 'points'),
        notSignedIn: getTextFromResource(getText, 'notSignedIn'),
        notEnoughPoints: getTextFromResource(getText, 'notEnoughPoints'),
        redeemPoints: getTextFromResource(getText, 'redeemPoints'),
        keepEarning: getTextFromResource(getText, 'keepEarning')
    }),
    ({ isAnonymous }, basket, {
        notSignedIn, redeemPoints, points, notEnoughPoints, keepEarning
    }) => {
        const biPointsAvailable = basket?.netBeautyBankPointsAvailable || 0;
        const hasEnoughPoints = biPointsAvailable >= RWD_REWARDS_LIST_MINIMUM_POINTS;
        let phase;

        if (isAnonymous) {
            phase = () => notSignedIn;
        } else if (hasEnoughPoints) {
            phase = () => (
                <>
                    {redeemPoints}{' '}
                    <Box
                        fontWeight='bold'
                        display='inline'
                    >
                        {biPointsAvailable}
                    </Box>{' '}
                    <Link
                        padding={2}
                        margin={-2}
                        color='blue'
                        onClick={e => rewardBazaarClickHandler(e)}
                        href='/profile/BeautyInsider'
                        children={'Beauty Insider'}
                    />{' '}
                    {points}
                    {'.'}
                </>
            );
        } else {
            phase = () => (
                <>
                    {notEnoughPoints}{' '}
                    <Box
                        fontWeight='bold'
                        display='inline'
                    >
                        {biPointsAvailable || 0}
                    </Box>{' '}
                    {points}
                    {'. '}
                    {keepEarning}
                </>
            );
        }

        return phase;
    }
);
