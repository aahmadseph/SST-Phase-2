/* eslint-disable class-methods-use-this,complexity */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import store from 'store/Store';
import { Box, Text, Grid } from 'components/ui';
import { COMPONENT_ID } from 'components/RichProfile/BeautyInsider/constants';
import helpersUtils from 'utils/Helpers';
import MyOffersLink from 'components/MyOffers/MyOffersLink';
import SDULandingPageModal from 'components/GlobalModals/SDULandingPageModal';
import bccUtils from 'utils/BCC';
import deliveryOptionsUtils from 'utils/DeliveryOptions';
import biUtils from 'utils/BiProfile';
import stringUtils from 'utils/String';
import promoUtils from 'utils/Promos';
import rougeUtils from 'utils/rougeExclusive';
import SDDRougeTestV2InfoModal from 'utils/SDDRougeTestV2InfoModal';
import BiGamificationLink from 'components/RichProfile/BeautyInsider/BiGamificationLink';
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import SummaryCard from 'components/Content/BeautyInsider/BeautyInsiderSummary/SummaryCard';
import { UserInfoReady } from 'constants/events';
import Empty from 'constants/empty';
import { ICON_TYPES_TO_IGNORE } from 'constants/beautyInsiderModules';

const getText = (text, vars) =>
    localeUtils.getLocaleResourceFile('components/Content/BeautyInsider/BeautyInsiderSummary/locales', 'BeautyInsiderSummary')(text, vars);

const { SAME_DAY_UNLIMITED_MODAL_US, SAME_DAY_UNLIMITED_MODAL_CA } = bccUtils.MEDIA_IDS;
const { replaceDoubleAsterisks } = helpersUtils;
const { isSDUAllowedForUser } = deliveryOptionsUtils;
const { embedHTML } = stringUtils;

const SECTION_TYPES = {
    CC_REWARDS: 'ccr',
    BI_CASH: 'cbr'
};

class BeautyInsiderSummary extends BaseClass {
    state = {
        availableRrcCoupons: [],
        isSDUAddedToBasket: false,
        bankRewards: [],
        renderSDULandingPage: false,
        eligibleForBirthdayGift: false,
        biSummary: {},
        biOffers: {},
        biPersonalizedOffers: {},
        user: {},
        isUserBi: false,
        isUserReady: false,
        isUserAtleastRecognized: false,
        userBiStatus: false,
        isEmployeeDiscountTrackerEnabled: Sephora.configurationSettings.ope.IsEmployeeDiscountTrackerEnabled || false
    };

    componentDidMount() {
        store.setAndWatch('basket.SDUProduct', this, ({ SDUProduct }) => {
            const isSDUAddedToBasket = SDUProduct?.isSDUAddedToBasket || false;
            this.setState({ isSDUAddedToBasket });
        });

        store.setAndWatch('beautyInsider.biRewardGroups', this, data => {
            if (data.biRewardGroups) {
                if (data.biRewardGroups.errors) {
                    this.setState({ biDown: true });
                } else {
                    this.setBiRewards(data.biRewardGroups);
                }
            }
        });

        store.setAndWatch('beautyInsider.summary', this, ({ summary }) => {
            if (summary) {
                this.setState({ biSummary: summary });
            }
        });

        store.setAndWatch('beautyInsider.biOffers', this, ({ biOffers }) => {
            if (biOffers && biOffers?.personalization) {
                this.setState({ biOffers });
            }
        });

        store.setAndWatch('beautyInsider.biPersonalizedOffers', this, ({ biPersonalizedOffers }) => {
            this.setState({ biPersonalizedOffers });
        });

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            store.setAndWatch('user', this, ({ user }) => {
                this.setState({
                    user: user,
                    isUserBi: userUtils.isBI(),
                    isUserReady: true,
                    isUserAtleastRecognized: userUtils.isUserAtleastRecognized(),
                    userBiStatus: userUtils.getBiStatus(),
                    eligibleForBirthdayGift: userUtils.isBirthdayGiftEligible(user),
                    bankRewards: userUtils.getBankRewards()
                });
            });

            store.setAndWatch('availableRrcCoupons', this, ({ availableRrcCoupons }) => {
                this.setState({ availableRrcCoupons: availableRrcCoupons?.coupons || [] });
            });
        });

        if (this.state.isEmployeeDiscountTrackerEnabled && this.props.isSephoraEmployee) {
            // Call action to fetch customer limit
            this.props.fetchCustomerLimit();
        }
    }

    setBiRewards = biRewardGroups => {
        const { rewardsLabels, getGiftLastDateToRedeem, getRealTimeBiStatus } = userUtils;
        const { REWARD_GROUPS } = biUtils;
        const {
            [REWARD_GROUPS.CELEBRATION]: celebrationGifts,
            [REWARD_GROUPS.BIRTHDAY]: birthdayGifts,
            [REWARD_GROUPS.REWARD]: biRewards
        } = biRewardGroups;

        const biRewardsLocal = [];

        if (celebrationGifts) {
            biRewardsLocal.push({
                key: 'celebrationGifts',
                items: celebrationGifts,
                title: getText('chooseYour', [rewardsLabels.CELEBRATION_GIFT.TITLE]),
                subtitle: rewardsLabels.CELEBRATION_GIFT.SUBTITLE.replace('{0}', getRealTimeBiStatus())
            });
        }

        if (birthdayGifts) {
            const { user } = this.state;
            const innerText = embedHTML(/(\d*)/, getGiftLastDateToRedeem(), 'strong');

            biRewardsLocal.push({
                key: 'bdayGifts',
                items: birthdayGifts,
                title: rewardsLabels.BIRTHDAY_GIFT.TITLE,
                subtitle: rewardsLabels.BIRTHDAY_GIFT.SUBTITLE.replace('{0}', user.firstName),
                secondSubtitle: { inner: innerText },
                componentId: COMPONENT_ID.BIRTHDAY
            });
        }

        biRewardsLocal.push(
            {
                key: 'ccRewards',
                type: SECTION_TYPES.CC_REWARDS,
                componentId: COMPONENT_ID.CREDIT_CARD_REWARDS
            },
            {
                key: 'BiCashRewards',
                type: SECTION_TYPES.BI_CASH,
                componentId: COMPONENT_ID.BI_CASH_BACK
            }
        );

        if (biRewards) {
            biRewardsLocal.push({
                key: 'biRewards',
                items: biRewards,
                title: rewardsLabels.REWARDS.TITLE,
                hasViewAll: true,
                componentId: COMPONENT_ID.REWARDS
            });
        }

        this.setState({ biRewards: biRewardsLocal });
    };

    toggleSDULandingPage = () => {
        this.setState(prevState => ({ renderSDULandingPage: !prevState.renderSDULandingPage }));
    };

    render() {
        const isUS = localeUtils.isUS();
        const isFrench = localeUtils.isFrench();
        const isSDDRougeFreeShipEligible = userUtils.isSDDRougeFreeShipEligible();
        const { discountText, isSephoraEmployee, customerLimitErrorIsEmpty, dtsDownErrorMessage } = this.props;
        const {
            availableRrcCoupons,
            isSDUAddedToBasket,
            bankRewards,
            renderSDULandingPage,
            eligibleForBirthdayGift,
            biSummary,
            biOffers,
            biPersonalizedOffers,
            user
        } = this.state;

        const { isMyOffersModuleEnabled, isGamificationEnabled, isGamificationEntryPointsEnabled } = Sephora?.configurationSettings;
        const { isGlobalEnabled } = Sephora.fantasticPlasticConfigurations;
        const highestDenomination =
            availableRrcCoupons && availableRrcCoupons.length > 0
                ? availableRrcCoupons.slice().sort((a, b) => b.denomination - a.denomination)[0].denomination
                : null;
        const currentYear = biSummary.clientSummary && biSummary.clientSummary.currentYear;
        const isYTDSaved = currentYear
            ? (currentYear.dollarsSaved && currentYear.dollarsSaved.value > 0) ||
              (currentYear.rougeRcDollar && currentYear.rougeRcDollar.value > 0) ||
              (currentYear.cashApplied && currentYear.cashApplied.value > 0)
            : false;

        const rewardsTotal = bankRewards && bankRewards.rewardsTotal;
        const hasYearAtGlanceLink = currentYear && currentYear.year && (isYTDSaved || rewardsTotal);
        const isRwdAdvocacyEnabled = Sephora.configurationSettings.isAdvocacyContentfulEnabled;
        const activeCampaigns = biSummary.activeCampaigns?.length && biSummary.activeCampaigns;

        const { SDDRougeTestThreshold } = biSummary;
        const isSDDRougeTestV2 = SDDRougeTestThreshold;

        const userSubscriptions = user.userSubscriptions || [];
        const isUserSDUTrialEligible = isSDUAllowedForUser(userSubscriptions);

        const showSDDRougeTestV2InfoModal = () => SDDRougeTestV2InfoModal.showModal(this.toggleSDULandingPage, SDDRougeTestThreshold);
        const isElegibleBiCashOptionExclusive = promoUtils.isElegibleBiCashOptionExclusive(biSummary.biCashOptions);
        const rougeExclusiveBadgeText = rougeUtils.isRougeExclusive() ? getText('rougeBadge') : '';
        const rougeBiCashExclusiveText = isElegibleBiCashOptionExclusive && rougeUtils.isRougeCashFlagEnabled ? getText('rougeBadge') : '';

        return (
            <>
                <Text
                    children={getText('title')}
                    is='h2'
                    fontWeight='bold'
                    fontSize={['md', null, 'lg']}
                    marginTop={3}
                    marginBottom={4}
                />

                <Box>
                    {isSDDRougeTestV2 && renderSDULandingPage && (
                        <SDULandingPageModal
                            isOpen={renderSDULandingPage}
                            onDismiss={this.toggleSDULandingPage}
                            mediaId={isUS ? SAME_DAY_UNLIMITED_MODAL_US : SAME_DAY_UNLIMITED_MODAL_CA}
                            isSDUAddedToBasket={isSDUAddedToBasket}
                            isUserSDUTrialEligible={isUserSDUTrialEligible}
                            isCanada={!isUS}
                            skipConfirmationModal={true}
                        />
                    )}

                    <Grid
                        columns={[1, 2, 4]}
                        gap={[2, null, 3]}
                    >
                        {isMyOffersModuleEnabled && (
                            <MyOffersLink
                                marginBottom={3}
                                isBlock={true}
                                variant='Card'
                                personalization={biOffers?.personalization}
                                personalizedOffer={biPersonalizedOffers}
                            />
                        )}

                        {isGamificationEnabled && isGamificationEntryPointsEnabled && <BiGamificationLink variant='Card' />}

                        {activeCampaigns?.length
                            ? activeCampaigns.map(({ content, campaignCode, campaignImage, alternateSummaryLink }, index) => {
                                if (isRwdAdvocacyEnabled && !content) {
                                    return null;
                                }

                                let imgSrc;
                                const { biProfileSummaryText, biProfileSummaryIcon } = content || Empty.Object;

                                if (isRwdAdvocacyEnabled && biProfileSummaryIcon) {
                                    imgSrc = !ICON_TYPES_TO_IGNORE.includes(biProfileSummaryIcon)
                                        ? `/img/ufe/icons/${biProfileSummaryIcon}.svg`
                                        : null;
                                } else if (campaignImage) {
                                    imgSrc = `/img/ufe/icons/${campaignImage}.svg`;
                                }

                                return (
                                    <SummaryCard
                                        key={`beautyInsider_summary_card_${index}`}
                                        href={`#${campaignCode}`}
                                        imgSrc={imgSrc}
                                        imgDataAt={Sephora.debug.dataAt('active_campaign_icon')}
                                        content={!isRwdAdvocacyEnabled && alternateSummaryLink}
                                        copyContent={isRwdAdvocacyEnabled && biProfileSummaryText}
                                    />
                                );
                            })
                            : null}

                        {eligibleForBirthdayGift ? (
                            <SummaryCard
                                href={`#${COMPONENT_ID.BIRTHDAY}`}
                                imgSrc='/img/ufe/icons/birthday.svg'
                                imgDataAt={Sephora.debug.dataAt('icon_birthday')}
                                text={getText('birthdayGiftTitle')}
                                textDataA={Sephora.debug.dataAt('birthday_msg')}
                            />
                        ) : null}

                        {biSummary.biPercentageOffAvailabilityMessage ? (
                            <SummaryCard
                                href={`#${COMPONENT_ID.POINTS_FOR_DISCOUNT}`}
                                imgSrc='/img/ufe/icons/points-discount.svg'
                                imgDataAt={Sephora.debug.dataAt('icon_pfd')}
                                content={replaceDoubleAsterisks(biSummary.biPercentageOffAvailabilityMessage)}
                                contentDataAt={Sephora.debug.dataAt('pfd_msg')}
                            />
                        ) : null}

                        {biSummary.pointMultiplierOptions && biSummary.pointMultiplierOptions.userMultiplier ? (
                            <SummaryCard
                                href={`#${COMPONENT_ID.POINTS_MULTIPLIER}`}
                                imgSrc='/img/ufe/icons/multiplier.svg'
                                imgDataAt={Sephora.debug.dataAt('icon_pme')}
                                content={getText('pointsMultiplierText', [biSummary.pointMultiplierOptions.userMultiplier.multiplier])}
                                contentDataAt={Sephora.debug.dataAt('pme_msg')}
                            />
                        ) : null}

                        {rewardsTotal && isGlobalEnabled && isUS ? (
                            <SummaryCard
                                href={`#${COMPONENT_ID.CREDIT_CARD_REWARDS}`}
                                imgSrc='/img/ufe/icons/cc.svg'
                                imgDataAt={Sephora.debug.dataAt('icon_credit_card')}
                                content={getText('bankRewards', [rewardsTotal])}
                                textDataA={Sephora.debug.dataAt('credit_card_msg')}
                            />
                        ) : null}

                        {highestDenomination && (
                            <SummaryCard
                                href={`#${COMPONENT_ID.ROUGE_REWARDS}`}
                                imgSrc='/img/ufe/icons/rouge-rewards.svg'
                                imgDataAt={Sephora.debug.dataAt('icon_rouge_rewards')}
                                content={getText('rougeRewardsApply', [!isFrench ? `$${highestDenomination}` : `${highestDenomination} $`])}
                                contentDataAt={Sephora.debug.dataAt('rouge_rewards_msg')}
                                rougeBadgeText={rougeExclusiveBadgeText}
                            />
                        )}

                        {biSummary.biCashBackAvailabilityMessage ? (
                            <SummaryCard
                                dataAt={Sephora.debug.dataAt('cbr_msg')}
                                href={`#${COMPONENT_ID.BI_CASH_BACK}`}
                                imgSrc='/img/ufe/icons/points-cash.svg'
                                imgDataAt={Sephora.debug.dataAt('icon_cbr')}
                                content={replaceDoubleAsterisks(biSummary.biCashBackAvailabilityMessage)}
                                contentDataAt={Sephora.debug.dataAt('bi_cash_drop')}
                                rougeBadgeText={rougeBiCashExclusiveText}
                            />
                        ) : null}

                        {biSummary.rewardBazarMessage ? (
                            <SummaryCard
                                dataAt={Sephora.debug.dataAt('rewards_bazaar_msg')}
                                href={`#${COMPONENT_ID.REWARDS}`}
                                imgSrc='/img/ufe/icons/reward-bazaar.svg'
                                imgDataAt={Sephora.debug.dataAt('icon_rewards_bazaar')}
                                content={replaceDoubleAsterisks(biSummary.rewardBazarMessage)}
                                contentDataAt={Sephora.debug.dataAt('birb_drop')}
                                rougeBadgeText={rougeExclusiveBadgeText}
                                showRougeBadgeInNextLine
                            />
                        ) : null}

                        {hasYearAtGlanceLink ? (
                            <SummaryCard
                                href={`#${COMPONENT_ID.YEAR_AT_A_GLANCE}`}
                                imgSrc='/img/ufe/icons/saving.svg'
                                imgDataAt={Sephora.debug.dataAt('icon_savings')}
                                text={getText('dollarsSaved', [currentYear.year])}
                                textDataAt={Sephora.debug.dataAt('savings_msg')}
                            />
                        ) : null}

                        {this.state.isEmployeeDiscountTrackerEnabled && isSephoraEmployee && (
                            <SummaryCard
                                iconName='offers'
                                iconDataAt={Sephora.debug.dataAt('employee_discount')}
                                content={customerLimitErrorIsEmpty ? discountText : dtsDownErrorMessage}
                                contentDataAt={Sephora.debug.dataAt('employee_discount_msg')}
                                disableUnderline={true}
                            />
                        )}

                        {isSDDRougeFreeShipEligible || isSDDRougeTestV2 ? (
                            <SummaryCard
                                onClick={showSDDRougeTestV2InfoModal}
                                iconName='bag'
                                iconDataAt={Sephora.debug.dataAt('icon_shipping')}
                                content={
                                    isSDDRougeTestV2
                                        ? getText('SDDRougeTestFreeShipping', [SDDRougeTestThreshold])
                                        : getText('rougeMemberFreeSameDayDelivery')
                                }
                                contentDataAt={Sephora.debug.dataAt('rouge_member_free_same_day_delivery')}
                            />
                        ) : (
                            <SummaryCard
                                href={`#${COMPONENT_ID.BI_GRID}`}
                                iconName='truck'
                                iconDataAt={Sephora.debug.dataAt('icon_shipping')}
                                content={getText('freeShip')}
                                contentDataAt={Sephora.debug.dataAt('shipping_msg')}
                            />
                        )}
                    </Grid>
                </Box>
            </>
        );
    }
}

export default wrapComponent(BeautyInsiderSummary, 'BeautyInsiderSummary', true);
