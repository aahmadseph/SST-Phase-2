/* eslint-disable camelcase */

import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import decorators from 'utils/decorators';

import store from 'store/Store';
import { site, space } from 'style/config';
import userUtils from 'utils/User';
import stringUtils from 'utils/String';
import beautyInsiderActions from 'actions/BeautyInsiderActions';
import biUtils from 'utils/BiProfile';
import localeUtils from 'utils/LanguageLocale';
import helperUtils from 'utils/Helpers';

import { COMPONENT_ID, STATUS_BAR_HEIGHT } from 'components/RichProfile/BeautyInsider/constants';
import { Box, Text, Divider } from 'components/ui';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import RewardsCarousel from 'components/RichProfile/BeautyInsider/RewardsCarousel/RewardsCarousel';
import BiInfoCard from 'components/RichProfile/BeautyInsider/BiInfoCard/BiInfoCard';
import ValueTable from 'components/RichProfile/BeautyInsider/ValueTable/ValueTable';
import RecentRewardActivity from 'components/RichProfile/BeautyInsider/RecentRewardActivity/RecentRewardActivity';
import RecentPointsActivity from 'components/RichProfile/BeautyInsider/RecentPointsActivity/RecentPointsActivity';
import ValueChips from 'components/RichProfile/BeautyInsider/ValueChips/ValueChips';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import PageRenderReport from 'components/PageRenderReport/PageRenderReport';
import BiWelcomeCard from 'components/RichProfile/BeautyInsider/BiWelcomeCard/BiWelcomeCard';
import CreditCardRewards from 'components/RichProfile/BeautyInsider/CreditCardRewards/CreditCardRewards';

import BeautyInsiderCash from 'components/RichProfile/BeautyInsider/BeautyInsiderCash/BeautyInsiderCash';
import BeautyInsiderPointMultiplier from 'components/RichProfile/BeautyInsider/BeautyInsiderPointMultiplier/BeautyInsiderPointMultiplier';
import PointsForDiscount from 'components/RichProfile/BeautyInsider/PointsForDiscount/PointsForDiscount';
import RougeRewards from 'components/RichProfile/BeautyInsider/RougeRewards/RougeRewards';
import ActiveCampaign from 'components/RichProfile/BeautyInsider/ActiveCampaign/ActiveCampaign';
import ScrollAnchor from 'components/ScrollAnchor/ScrollAnchor';
import bccUtils from 'utils/BCC';
import { UserInfoReady } from 'constants/events';

const { embedHTML } = stringUtils;
const { getProp } = helperUtils;
const { COMPONENT_NAMES } = bccUtils;
const ensureUserIsAtLeastRecognized = decorators.ensureUserIsAtLeastRecognized;
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/locales', 'BeautyInsider');

const beautyInsiderButtonsDataAt = {
    bihq_benefits_chart_1_ppd_2019_bi_benefits_dt_us_010119_image: 'points_per_dollar',
    bihq_benefits_chart_2_bd_2019_bi_benefits_dt_us_010119_image: 'birthday_gift',
    bihq_benefits_chart_3_ss_2019_bi_benefits_dt_us_010119_image: 'seasonal_savings',
    bihq_benefits_chart_4_tier_celebration_2019_bi_benefits_dt_us_010119_image: 'tier_celebration_gift',
    bihq_benefits_chart_5_free_shipping_2019_bi_benefits_dt_us_010119_image: 'free_standart_shipping',
    bihq_benefits_chart_6_early_access_2019_bi_benefits_dt_us_010119_image: 'early_access_to_products',
    bihq_benefits_chart_7_exclusive_events_2019_bi_benefits_dt_us_010119_image: 'exclusive_events',
    bihq_benefits_chart_8_rewards_bazaar_2019_bi_benefits_dt_us_010119_image: 'rewards_bazaar'
};

class BeautyInsider extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            user: null,
            isUserBi: false,
            isUserReady: false,
            isUserAtleastRecognized: false,
            biRewards: [],
            userBiStatus: '',
            biSummary: {},
            biDown: false
        };
        this.stickyStatusEnd = React.createRef();
    }

    componentDidMount() {
        store.dispatch(beautyInsiderActions.fetchBiRewards());

        store.setAndWatch('beautyInsider.biRewardGroups', this, data => {
            if (data.biRewardGroups) {
                if (data.biRewardGroups.errors) {
                    this.setState({ biDown: true });
                } else {
                    this.setBiRewards(data.biRewardGroups);
                }
            }
        });

        store.setAndWatch('basket.isBIPointsAvailable', this, data => {
            if (data.isBIPointsAvailable === false) {
                this.setState({ biDown: true });
            }
        });

        store.setAndWatch('beautyInsider.summary', this, ({ summary }) => {
            if (summary) {
                this.setState({ biSummary: summary });
            }
        });

        store.setAndWatch('availableRrcCoupons', this, ({ availableRrcCoupons }) => {
            this.setState({ availableRrcCoupons: availableRrcCoupons?.coupons || [] });
        });

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            store.setAndWatch('user', this, value => {
                this.setState({
                    user: value.user,
                    isUserBi: userUtils.isBI(),
                    isUserReady: true,
                    isUserAtleastRecognized: userUtils.isUserAtleastRecognized(),
                    userBiStatus: userUtils.getBiStatus()
                });

                store.dispatch(beautyInsiderActions.fetchClientSummary(value.user.profileId, true));
            });
        });
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
                type: this.SECTION_TYPES.CC_REWARDS,
                componentId: COMPONENT_ID.CREDIT_CARD_REWARDS
            },
            {
                key: 'BiCashRewards',
                type: this.SECTION_TYPES.BI_CASH,
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

    renderAnchor = (id, key) => {
        return (
            <ScrollAnchor
                key={key}
                id={id}
                offset={Sephora.isMobile() ? STATUS_BAR_HEIGHT + space[5] : space[7]}
            />
        );
    };

    renderBiCard = () => {
        const { user, isUserBi, biSummary } = this.state;

        return (
            <React.Fragment>
                {isUserBi ? (
                    <BiInfoCard
                        stickyStatusEnd={this.state.biDown ? null : this.stickyStatusEnd.current}
                        user={user}
                        biSummary={biSummary}
                        isBIPointsUnavailable={this.state.biDown}
                    />
                ) : (
                    <BiWelcomeCard />
                )}
                <LegacyContainer>{Sephora.isMobile() && this.renderDivider(true)}</LegacyContainer>
            </React.Fragment>
        );
    };

    renderBccRegions = region => {
        const REGIONS = {
            TOP: 'left',
            MIDDLE: 'content',
            BOTTOM: 'right'
        };

        const currentRegion = REGIONS[region];

        if (!(this.props.regions && this.props.regions[currentRegion])) {
            return null;
        }

        switch (region) {
            case 'TOP':
                return (
                    <LegacyContainer>
                        <BccComponentList items={this.props.regions[currentRegion]} />
                    </LegacyContainer>
                );
            case 'MIDDLE':
            case 'BOTTOM':
                return (
                    <React.Fragment>
                        {this.renderDivider()}
                        {this.renderAnchor(COMPONENT_ID.BI_GRID)}
                        <BccComponentList
                            items={this.props.regions[currentRegion]}
                            propsCallback={function (componentType, name) {
                                const dataAt = beautyInsiderButtonsDataAt[name];

                                if (dataAt && componentType === COMPONENT_NAMES.IMAGE) {
                                    return { dataAt: dataAt };
                                } else {
                                    return null;
                                }
                            }}
                        />
                    </React.Fragment>
                );
            default:
                return null;
        }
    };

    renderPointsForDiscount = () => {
        return this.state.biSummary && this.state.biSummary.biPercentageOffOptions ? (
            <React.Fragment>
                {this.renderAnchor(COMPONENT_ID.POINTS_FOR_DISCOUNT)}
                <PointsForDiscount
                    biPercentageOffAvailabilityMessage={this.state.biSummary.biPercentageOffAvailabilityMessage}
                    {...this.state.biSummary.biPercentageOffOptions}
                />
                {this.renderDivider()}
            </React.Fragment>
        ) : null;
    };

    renderPointMultiplier = () => {
        return this.state.biSummary && this.state.biSummary.pointMultiplierOptions ? (
            <React.Fragment>
                {this.renderAnchor(COMPONENT_ID.POINTS_MULTIPLIER)}
                <BeautyInsiderPointMultiplier {...this.state.biSummary.pointMultiplierOptions} />
                {!this.state.componentReorder && this.renderDivider()}
            </React.Fragment>
        ) : null;
    };

    renderRougeRewards = () => {
        return this.state.availableRrcCoupons?.length ? (
            <React.Fragment>
                {this.renderAnchor(COMPONENT_ID.ROUGE_REWARDS)}
                <RougeRewards availableRrcCoupons={this.state.availableRrcCoupons} />
                {this.renderDivider()}
            </React.Fragment>
        ) : null;
    };

    renderActiveCampaigns = () => {
        return this.state.biSummary?.activeCampaigns?.length
            ? this.state.biSummary.activeCampaigns.map(campaign => (
                <React.Fragment key={campaign.campaignCode}>
                    {this.renderAnchor(campaign.campaignCode)}
                    <ActiveCampaign activeCampaign={campaign} />
                    {this.renderDivider()}
                </React.Fragment>
            ))
            : null;
    };

    renderRewards = () => {
        const { biRewards, user, biSummary } = this.state;

        const biCashOptions = biSummary.biCashOptions || [];
        const biRewardsJsx = [];
        const isUS = localeUtils.isUS();

        if (biRewards.length) {
            for (const biReward of biRewards) {
                let biRewardComponent;
                const key = biReward.key;

                switch (biReward.type) {
                    case this.SECTION_TYPES.CC_REWARDS:
                        if (
                            user &&
                            user.bankRewards &&
                            user.bankRewards.ccRewardStatus &&
                            Sephora.fantasticPlasticConfigurations.isGlobalEnabled &&
                            isUS
                        ) {
                            biRewardComponent = (
                                <CreditCardRewards
                                    key={key}
                                    bankRewards={user.bankRewards}
                                />
                            );
                        }

                        break;
                    case this.SECTION_TYPES.BI_CASH:
                        if (
                            biCashOptions &&
                            biCashOptions.availablePromotions &&
                            biCashOptions.availablePromotions.length &&
                            Sephora.configurationSettings.isCashBackRewardsEnabled
                        ) {
                            biRewardComponent = (
                                <BeautyInsiderCash
                                    key={key}
                                    biCashOptions={biCashOptions}
                                />
                            );
                        }

                        break;
                    default:
                        biRewardComponent = (
                            <RewardsCarousel
                                badges={true}
                                {...biReward}
                            />
                        );
                }

                if (biRewardComponent) {
                    biRewardsJsx.length > 0 && biRewardsJsx.push(this.renderDivider(false, { key: `dividerFor${key}` }));
                    biRewardsJsx.push(this.renderAnchor(biReward.componentId, `anchorFor${key}`), biRewardComponent);
                }
            }
        }

        return biRewardsJsx;
    };

    renderChipsAndTable = () => {
        const isDesktop = Sephora.isDesktop();

        const {
            user, isUserBi, isUserReady, isUserAtleastRecognized, biSummary
        } = this.state;

        const clientSummary = biSummary.clientSummary || {};
        const isBiUserReady = isUserReady && isUserAtleastRecognized && isUserBi;
        const rewardsTotal = user && user.bankRewards && user.bankRewards.YTDRewardsEarned;

        if (!isBiUserReady) {
            return null;
        }

        return (
            getProp(clientSummary, 'currentYear.year') && (
                <React.Fragment>
                    {this.renderDivider()}
                    {this.renderAnchor(COMPONENT_ID.YEAR_AT_A_GLANCE)}
                    <Box textAlign={isDesktop && 'center'}>
                        <Text
                            is='h2'
                            fontFamily='serif'
                            lineHeight='tight'
                            fontSize={isDesktop ? '2xl' : 'xl'}
                            marginBottom='1em'
                            children={getText('yearAtGlance', [clientSummary.currentYear.year])}
                        />
                        <ValueTable
                            clientSummary={clientSummary}
                            rewardsTotal={rewardsTotal}
                        />
                    </Box>
                </React.Fragment>
            )
        );
    };

    renderDivider = (isThick, props = {}) => {
        const isMobile = Sephora.isMobile();

        return (
            <Divider
                {...(isThick && {
                    height: 2,
                    color: 'nearWhite'
                })}
                {...props}
                marginY={isMobile ? 5 : 7}
                marginX={isMobile && '-container'}
            />
        );
    };

    SECTION_TYPES = {
        CC_REWARDS: 'ccr',
        BI_CASH: 'cbr'
    };

    render() {
        const { user, isUserBi, isUserReady, isUserAtleastRecognized } = this.state;

        const isBiUserReady = isUserReady && isUserAtleastRecognized && isUserBi;

        return (
            <div>
                <main>
                    {this.renderBccRegions('TOP')}
                    {!Sephora.isNodeRender && isUserReady && (
                        <div>
                            {!isUserAtleastRecognized && <BiWelcomeCard />}
                            {isUserAtleastRecognized && this.renderBiCard()}
                        </div>
                    )}
                    <LegacyContainer>
                        {this.renderActiveCampaigns()}
                        {this.renderPointsForDiscount()}
                        {this.renderPointMultiplier()}
                        {this.renderRougeRewards()}
                        {this.renderRewards()}
                        {this.renderChipsAndTable()}
                        {isBiUserReady && (
                            <React.Fragment>
                                {this.renderDivider()}
                                <RecentRewardActivity user={user} />
                                {this.renderDivider()}
                                <RecentPointsActivity user={user} />
                                {this.renderDivider()}
                                <ValueChips profileId={user ? user.profileId : null} />
                            </React.Fragment>
                        )}
                        {this.renderBccRegions('MIDDLE')}
                        {this.renderBccRegions('BOTTOM')}
                        {Sephora.isMobile() && (
                            <div
                                ref={this.stickyStatusEnd}
                                css={{
                                    position: 'relative',
                                    zIndex: -1,
                                    paddingTop: site.headerHeight + STATUS_BAR_HEIGHT,
                                    marginTop: -(site.headerHeight + STATUS_BAR_HEIGHT)
                                }}
                            />
                        )}
                    </LegacyContainer>
                </main>
                <PageRenderReport />
            </div>
        );
    }
}

export default wrapComponent(ensureUserIsAtLeastRecognized(BeautyInsider), 'BeautyInsider');
