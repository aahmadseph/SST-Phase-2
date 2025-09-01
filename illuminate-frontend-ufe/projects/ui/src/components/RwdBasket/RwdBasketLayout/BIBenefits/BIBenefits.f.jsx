import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import Authentication from 'utils/Authentication';
import RwdBasketActions from 'actions/RwdBasketActions/RwdBasketActions';
import {
    Text, Box, Link, Grid, Divider
} from 'components/ui';
import localeUtils from 'utils/LanguageLocale';
import * as rwdBasketConstants from 'constants/RwdBasket';
import { colors } from 'style/config';
import BIBenefitsRewards from 'components/RwdBasket/RwdBasketLayout/BIBenefits/BIBenefitsRewards/BIBenefitsRewards';
import RewardsBazaar from 'components/RwdBasket/RwdBasketLayout/BIBenefits/RewardsBazaar/RewardsBazaar';
import CCRewards from 'components/RwdBasket/RwdBasketLayout/BIBenefits/CCRewards/CCRewards';
import CreditCardProgram from 'components/RwdBasket/RwdBasketLayout/BIBenefits/CreditCardProgram';
import CashBackRewards from 'components/RwdBasket/RwdBasketLayout/BIBenefits/CashBackRewards';
import FreeSamples from 'components/RwdBasket/RwdBasketLayout/BIBenefits/FreeSamples';

import isFunction from 'utils/functions/isFunction';
import FeaturedOffers from 'components/RwdBasket/RwdBasketLayout/BIBenefits/FeaturedOffers';
import RCPSCookies from 'utils/RCPSCookies';
import { HEADER_VALUE } from 'constants/authentication';

const {
    BI_BENEFITS_ITEM_TYPES: {
        ROUGE_REWARDS, CC_REWARDS, BI_POINTS, REWARDS_BAZAAR, FREE_SAMPLES
    },
    BASKET_RENDERING_TYPE_DYNAMIC_ATTRIBUTE: { ITEM_TYPE }
} = rwdBasketConstants;
const { openBIRegisterModal } = RwdBasketActions;
const getText = localeUtils.getLocaleResourceFile('components/RwdBasket/RwdBasketLayout/BIBenefits/locales', 'BIBenefits');

function BIBenefitsRewardsArranged({
    rougeRewards,
    ccRewards,
    rewardsBazaar,
    showFreeSamplesUI,
    samplesAdded,
    biBenefitsContentData,
    onBasketSwitch,
    biAccount,
    infoModalCallbacks,
    cxsMissing,
    isSignedIn,
    ccTargeters,
    ccBanner,
    cbr,
    basketType //TS-3142 - showApplyPointsForBazaarItems
}) {
    if (cxsMissing) {
        return null;
    }

    const getCCRewardsTile = () => {
        let compToRender = null;

        if (localeUtils.isUS()) {
            if (ccRewards.showCCRewards) {
                compToRender = (
                    <CCRewards
                        {...ccRewards}
                        infoModalCallback={infoModalCallbacks.ccTermsConditions}
                    />
                );
            } else {
                if (RCPSCookies.isRCPSCCAP()) {
                    compToRender = ccBanner ? (
                        <CreditCardProgram
                            ccTargeters={ccBanner}
                            isSignedIn={isSignedIn}
                        />
                    ) : null;
                } else {
                    compToRender = ccTargeters ? (
                        <CreditCardProgram
                            ccTargeters={ccTargeters}
                            isSignedIn={isSignedIn}
                        />
                    ) : null;
                }
            }
        }

        return compToRender;
    };

    const biBenefitsTiles = biBenefitsContentData
        .map(comp => {
            const itemType = comp.items?.find(item => item.key.toLowerCase() === ITEM_TYPE.toLowerCase())?.value || '';

            return (
                itemType.length > 0 &&
                {
                    [ROUGE_REWARDS]: rougeRewards.showRougeRewardsUI ? (
                        <BIBenefitsRewards
                            {...rougeRewards}
                            onBasketSwitch={onBasketSwitch}
                            rougeInfoModalCallback={infoModalCallbacks.applyRougeRewards}
                            rougeBadgeText={getText('rougeBadge')}
                        />
                    ) : null,
                    [CC_REWARDS]: getCCRewardsTile(),
                    [BI_POINTS]: cbr.isAvailable ? (
                        <CashBackRewards
                            {...cbr}
                            infoModalCallback={infoModalCallbacks.cbr}
                        />
                    ) : null,
                    [REWARDS_BAZAAR]: rewardsBazaar.showRewardsBazaar ? (
                        <RewardsBazaar
                            biAccount={biAccount}
                            rougeBadgeText={getText('rougeBadge')}
                            basketType={basketType} //TS-3142 - showApplyPointsForBazaarItems
                            {...rewardsBazaar}
                        />
                    ) : null,
                    [FREE_SAMPLES]: showFreeSamplesUI ? <FreeSamples samplesAdded={samplesAdded} /> : null
                }[itemType]
            );
        })
        .filter(value => value != null);

    return (
        <Grid
            borderRadius={2}
            width='100%'
            display='block'
            lineHeight='tight'
            marginTop={4}
            backgroundColor={colors.white}
            gap={3}
            alignItems={'center'}
        >
            {biBenefitsTiles &&
                biBenefitsTiles.map((tile, i) => (
                    <React.Fragment key={`bi_benefits_tile_${i}`}>
                        {tile}
                        {i < biBenefitsTiles.length - 1 && <Divider />}
                    </React.Fragment>
                ))}
        </Grid>
    );
}

function CXSError({ cxsMissing, isBIDown }) {
    return cxsMissing || isBIDown ? (
        <Box
            paddingTop={1}
            marginBottom={1}
            color={colors.red}
        >
            {getText('cxsMissingMessage')}
        </Box>
    ) : null;
}

const signInHandler = event => {
    event.stopPropagation();
    Authentication.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
};

const joinNowHandler = event => {
    event.stopPropagation();
    openBIRegisterModal({ isOpen: true });
};

function SignIn({
    isSignedIn, biAccount, cxsMissing, isBiDown, isNonBI, orderExceedsBiPointsError
}) {
    if (cxsMissing || isBiDown) {
        return null;
    }

    if (orderExceedsBiPointsError && orderExceedsBiPointsError.length > 0) {
        // Excessive checkout btn clicking causes same error to be added/make them unique
        const uniqueErrorMessages = [...new Set(orderExceedsBiPointsError)];

        return (
            <Box
                paddingTop={1}
                marginBottom={1}
                color={colors.red}
            >
                {uniqueErrorMessages.map((errorMessage, index) => (
                    <p key={index}>{errorMessage}</p>
                ))}
            </Box>
        );
    }

    const biPoints = biAccount?.biPoints;

    return isSignedIn ? (
        isNonBI ? (
            <Text is='p'>
                <Link
                    color='blue'
                    onClick={joinNowHandler}
                >
                    {getText('joinNow')}
                </Link>
                {` ${getText('joinNowSubText')}`}
            </Text>
        ) : (
            <Text
                dangerouslySetInnerHTML={{
                    __html: biPoints >= 0 ? getText('biPoints', [biPoints]) : getText('noBiPoints', [biPoints])
                }}
            />
        )
    ) : (
        <Text is='p'>
            <Link
                color='blue'
                onClick={signInHandler}
            >
                {getText('signIn')}
            </Link>
            {` ${getText('signInSubText')}`}
        </Text>
    );
}

function BIBenefits({
    biBenefitsInfo, onBasketSwitch, order = [1, 3], showBasketGreyBackground, boxShadow, basketType
}) {
    const {
        rougeRewards,
        ccRewards,
        rewardsBazaar,
        isSignedIn,
        showFreeSamplesUI,
        samplesAdded,
        biAccount,
        biBenefitsContentData,
        infoModalCallbacks,
        bopisFeaturedOffers,
        ccTargeters,
        ccBanner,
        cbr,
        isBIDown,
        isNonBI,
        biBenefitsErrors
    } = biBenefitsInfo;

    const cxsMissing = biBenefitsContentData.length === 0;
    const featuredOffersMissing = !isFunction(infoModalCallbacks.featuredOffers);
    const updatedRougeRewards = { ...rougeRewards, showChevron: rougeRewards.showRougeRewardsChevron && !rougeRewards.disableRougeRewards };

    return (
        <Box
            borderRadius={2}
            display='block'
            padding={4}
            lineHeight='tight'
            backgroundColor={showBasketGreyBackground ? colors.white : colors.nearWhite}
            {...(showBasketGreyBackground && { boxShadow: boxShadow })}
            order={order}
            marginX={[0, null, 0]}
        >
            <Text
                is='div'
                fontSize='lg'
                fontWeight='bold'
            >
                {getText('title')}
            </Text>
            <CXSError
                cxsMissing={cxsMissing}
                isBIDown={isBIDown}
            />
            <SignIn
                isSignedIn={isSignedIn}
                biAccount={biAccount}
                cxsMissing={cxsMissing}
                isBiDown={isBIDown}
                isNonBI={isNonBI}
                orderExceedsBiPointsError={biBenefitsErrors}
            />
            <BIBenefitsRewardsArranged
                rougeRewards={updatedRougeRewards}
                ccRewards={ccRewards}
                rewardsBazaar={rewardsBazaar}
                showFreeSamplesUI={showFreeSamplesUI}
                samplesAdded={samplesAdded}
                biBenefitsContentData={biBenefitsContentData}
                onBasketSwitch={onBasketSwitch}
                biAccount={biAccount}
                infoModalCallbacks={infoModalCallbacks}
                cxsMissing={cxsMissing}
                isSignedIn={isSignedIn}
                ccTargeters={ccTargeters}
                ccBanner={ccBanner}
                cbr={cbr}
                basketType={basketType} //TS-3142 - showApplyPointsForBazaarItems
            />
            <FeaturedOffers
                infoModalCallbacks={infoModalCallbacks}
                bopisFeaturedOffers={bopisFeaturedOffers}
                featuredOffersMissing={featuredOffersMissing}
            />
        </Box>
    );
}

export default wrapFunctionalComponent(BIBenefits, 'BIBenefits');
