/* eslint-disable class-methods-use-this */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Grid } from 'components/ui';
import BirthdayGifts from 'components/Content/BeautyInsider/BeautyInsiderModules/BirthdayGifts/BirthdayGifts';
import PointsForDiscount from 'components/Content/BeautyInsider/BeautyInsiderModules/PointsForDiscount';
import PointMultiplierEvent from 'components/Content/BeautyInsider/BeautyInsiderModules/PointMultiplierEvent';
import CreditCardRewards from 'components/Content/BeautyInsider/BeautyInsiderModules/CreditCardRewards';
import BiCashOptions from 'components/Content/BeautyInsider/BeautyInsiderModules/BiCashOptions';
import YearAtAGlance from 'components/Content/BeautyInsider/BeautyInsiderModules/YearAtAGlance';
import BiRewardsCarousel from 'components/Content/BeautyInsider/BeautyInsiderModules/BiRewardsCarousel/BiRewardsCarousel';
import RewardsRedeemed from 'components/Content/BeautyInsider/BeautyInsiderModules/RewardsRedeemed/RewardsRedeemed';
import RougeRewards from 'components/Content/BeautyInsider/BeautyInsiderModules/RougeRewards/RougeRewards';
import GetMoreFromMembership from 'components/Content/BeautyInsider/BeautyInsiderModules/GetMoreFromMembership/GetMoreFromMembership';
import PointsActivity from 'components/Content/BeautyInsider/BeautyInsiderModules/PointsActivity/PointsActivity';
import RougeRewardsCarousel from 'components/RougeRewardsCarousel';
import ActiveCampaign from 'components/Content/BeautyInsider/BeautyInsiderModules/ActiveCampaign';
import localeUtils from 'utils/LanguageLocale';
import { COMPONENT_ID } from 'components/RichProfile/BeautyInsider/constants';
import ScrollAnchor from 'components/ScrollAnchor/ScrollAnchor';
import { DebouncedResize } from 'constants/events';
import { breakpoints } from 'style/config';
import rougeExclusiveUtils from 'utils/rougeExclusive';
import anaConstants from 'analytics/constants';
import LazyLoad from 'components/LazyLoad';

class BeautyInsiderModules extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            isMobile: false
        };
    }

    checkIsMobile = () => {
        this.setState({
            isMobile: window.matchMedia(breakpoints.smMax).matches
        });
    };

    componentDidMount() {
        this.checkIsMobile();
        window.addEventListener(DebouncedResize, this.checkIsMobile);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.checkIsMobile);
    }

    renderAnchor = (id, key) => {
        return (
            <ScrollAnchor
                key={key}
                id={id}
                offset={this.state.isMobile ? 42 : 0}
            />
        );
    };

    renderRougeRewardsCarousel = () => {
        if (!rougeExclusiveUtils.isRougeExclusive()) {
            return null;
        }

        return (
            <LazyLoad
                component={RougeRewardsCarousel}
                marginTop={6}
                renderBiButton={false}
                showViewAll
                analyticsContext={anaConstants.CONTEXT.BASKET_REWARDS}
            />
        );
    };

    render() {
        return (
            <>
                {this.props.birthdayGifts && (
                    <>
                        {this.renderAnchor(COMPONENT_ID.BIRTHDAY)}
                        <BirthdayGifts
                            items={this.props.birthdayGifts}
                            userName={this.props.user.firstName}
                        />
                    </>
                )}
                {this.renderRougeRewardsCarousel()}
                {this.props.beautyInsiderSummary?.activeCampaigns?.map(campaign => (
                    <>
                        {this.renderAnchor(campaign.campaignCode)}
                        <ActiveCampaign content={campaign} />
                    </>
                ))}
                {this.props.beautyInsiderSummary?.biPercentageOffOptions && (
                    <>
                        {this.renderAnchor(COMPONENT_ID.POINTS_FOR_DISCOUNT)}
                        <PointsForDiscount content={this.props.beautyInsiderSummary?.biPercentageOffOptions} />
                    </>
                )}
                {this.props.beautyInsiderSummary?.pointMultiplierOptions && (
                    <>
                        {this.renderAnchor(COMPONENT_ID.POINTS_MULTIPLIER)}
                        <PointMultiplierEvent content={this.props.beautyInsiderSummary?.pointMultiplierOptions} />
                    </>
                )}
                {this.props.user?.ccRewards?.bankRewards?.ccRewardStatus &&
                    Sephora.fantasticPlasticConfigurations.isGlobalEnabled &&
                    localeUtils.isUS() && (
                    <>
                        {this.renderAnchor(COMPONENT_ID.CREDIT_CARD_REWARDS)}
                        <CreditCardRewards content={this.props.user.ccRewards?.bankRewards} />
                    </>
                )}
                {this.props.rougeRewardsCoupons?.length > 0 && (
                    <>
                        {this.renderAnchor(COMPONENT_ID.ROUGE_REWARDS)}
                        <RougeRewards coupons={this.props.rougeRewardsCoupons} />
                    </>
                )}
                {!this.state.isMobile ? (
                    <>
                        {this.renderAnchor(COMPONENT_ID.BI_CASH_BACK)}
                        {this.renderAnchor(COMPONENT_ID.YEAR_AT_A_GLANCE)}
                        <Grid
                            columns={[0, 1]}
                            gap={1}
                        >
                            {this.props.beautyInsiderSummary?.biCashOptions && (
                                <BiCashOptions content={this.props.beautyInsiderSummary?.biCashOptions} />
                            )}
                            <YearAtAGlance
                                content={this.props.beautyInsiderSummary?.clientSummary?.currentYear}
                                bankRewards={this.props.user?.ccRewards?.bankRewards}
                            />
                        </Grid>
                    </>
                ) : (
                    <>
                        {this.renderAnchor(COMPONENT_ID.BI_CASH_BACK)}
                        {this.props.beautyInsiderSummary?.biCashOptions && <BiCashOptions content={this.props.beautyInsiderSummary?.biCashOptions} />}
                        {this.renderAnchor(COMPONENT_ID.YEAR_AT_A_GLANCE)}
                        <YearAtAGlance
                            content={this.props.beautyInsiderSummary?.clientSummary?.currentYear}
                            bankRewards={this.props.user?.ccRewards?.bankRewards}
                        />
                    </>
                )}
                {this.props.biRewards?.length && (
                    <>
                        {this.renderAnchor(COMPONENT_ID.REWARDS)}
                        <BiRewardsCarousel
                            items={this.props.biRewards}
                            showOmniRewardsNotice={this.props.showOmniRewardsNotice}
                        />
                    </>
                )}
                <>
                    {this.renderAnchor(COMPONENT_ID.REWARDS)}
                    <RewardsRedeemed content={this.props.redeemedRewards} />
                </>
                <PointsActivity content={this.props.accountHistorySlice} />
                <GetMoreFromMembership
                    hasCreditCard={this.props.user?.beautyInsiderAccount?.ccAccountandPrescreenInfo?.ccApprovalStatus === 'APPROVED'}
                />
                {this.renderAnchor(COMPONENT_ID.BI_GRID)}
            </>
        );
    }
}

export default wrapComponent(BeautyInsiderModules, 'BeautyInsiderModules');
