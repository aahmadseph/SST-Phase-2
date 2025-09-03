import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import biApi from 'services/api/beautyInsider';
import store from 'store/Store';
import watch from 'redux-watch';
import userUtils from 'utils/User';
import basketUtils from 'utils/Basket';
import bindingMethods from 'analytics/bindingMethods/pages/all/generalBindings';
import Actions from 'Actions';

import {
    mediaQueries, colors, site, space
} from 'style/config';
import {
    Link, Box, Flex, Image, Text, Icon
} from 'components/ui';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';

import BiUnavailable from 'components/Reward/BiUnavailable/BiUnavailable';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import Modal from 'components/Modal/Modal';
import BiBarcode from 'components/BiBarcode/BiBarcode';
import { COMPONENT_ID, STATUS_BAR_HEIGHT } from 'components/RichProfile/BeautyInsider/constants';
import BiBackground from 'components/RichProfile/BeautyInsider/BiBackground/BiBackground';
import Markdown from 'components/Markdown/Markdown';
import helperUtils from 'utils/Helpers';
import localeUtils from 'utils/LanguageLocale';
import MyOffersLink from 'components/MyOffers/MyOffersLink';
import SDULandingPageModal from 'components/GlobalModals/SDULandingPageModal';
import bccUtils from 'utils/BCC';
import deliveryOptionsUtils from 'utils/DeliveryOptions';

import SDDRougeTestV2InfoModal from 'utils/SDDRougeTestV2InfoModal';
import BiGamificationLink from 'components/RichProfile/BeautyInsider/BiGamificationLink';
import { DebouncedScroll } from 'constants/events';

const { replaceDoubleAsterisks } = helperUtils;
const {
    MEDIA_IDS: { SAME_DAY_UNLIMITED_MODAL_US, SAME_DAY_UNLIMITED_MODAL_CA }
} = bccUtils;
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/BeautyInsider/BiInfoCard/locales', 'BiInfoCard');
const BI_TYPES = userUtils.types;
const iconOffset = 40;

const styles = {
    LIST_ITEMS: {
        display: 'flex',
        alignItems: 'center'
    },
    IMG_PROPS: {
        width: 24,
        height: 24,
        marginRight: 4,
        marginLeft: -iconOffset
    }
};

class BiInfoCard extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            realTimeVIBMessages: null,
            netBeautyBankPointsAvailable: 0,
            showBarcode: false,
            renderSDULandingPage: false
        };
        this.stickyStatusStart = React.createRef();
    }

    componentDidMount() {
        if (!this.props.isBIPointsUnavailable) {
            const watchBasket = watch(store.getState, 'basket');
            store.subscribe(
                watchBasket((newBasket, prevBasket) => {
                    if (newBasket.netBeautyBankPointsAvailable !== prevBasket.netBeautyBankPointsAvailable) {
                        bindingMethods.setUserPropsWithCurrentData();
                    }

                    this.setState({
                        netBeautyBankPointsAvailable: basketUtils.getAvailableBiPoints(true)
                    });
                }),
                this
            );

            biApi.getBiPoints(this.props.user.profileId).then(biInfo => {
                this.setState({
                    realTimeVIBMessages: biInfo.realTimeVIBMessages,
                    netBeautyBankPointsAvailable: biInfo.netBeautyBankPointsAvailable,
                    eligibleForBirthdayGift: userUtils.isBirthdayGiftEligible(),
                    bankRewards: userUtils.getBankRewards()
                });
            });
        }

        store.setAndWatch('basket.SDUProduct', this, ({ SDUProduct }) => {
            const isSDUAddedToBasket = SDUProduct?.isSDUAddedToBasket || false;

            this.setState({ isSDUAddedToBasket });
        });

        store.setAndWatch('availableRrcCoupons', this, ({ availableRrcCoupons }) => {
            this.setState({ availableRrcCoupons: availableRrcCoupons?.coupons || [] });
        });

        if (Sephora.isMobile() && !this.props.isMinimal && !this.props.isBIPointsUnavailable) {
            window.addEventListener(DebouncedScroll, this.handleScroll);
        }
    }

    handleScroll = () => {
        let showStickyStatus = false;
        const currentScroll = window.scrollY;
        const startPos = this.stickyStatusStart.current.offsetTop;
        const endPos = this.props.stickyStatusEnd.offsetTop;

        if (currentScroll > startPos && currentScroll < endPos) {
            showStickyStatus = true;
        }

        if (showStickyStatus !== this.state.showStickyStatus) {
            this.setState({ showStickyStatus });
        }
    };

    showInfoModal = (options = {}) => {
        return store.dispatch(Actions.showInfoModal(options));
    };

    renderLockup = () => {
        const isMobile = Sephora.isMobile();
        const biStatus = userUtils.getBiStatus();
        const statusDisplay = userUtils.displayBiStatus(biStatus);

        const logoProps = {
            src: `/img/ufe/bi/logo-${statusDisplay.toLowerCase()}.svg`,
            height: isMobile ? 17 : 22,
            alt: statusDisplay
        };

        const { isMinimal } = this.props;
        const { showStickyStatus } = this.state;

        return (
            <React.Fragment>
                <div
                    css={[
                        {
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        },
                        isMobile
                            ? {
                                position: 'sticky',
                                top: site.headerHeight,
                                left: 0,
                                right: 0,
                                height: STATUS_BAR_HEIGHT,
                                zIndex: 1,
                                backgroundColor: 'white',
                                boxShadow: '0 2px 4px 0 var(--color-darken1)',
                                [mediaQueries.sm]: {
                                    top: 0
                                }
                            }
                            : {
                                marginTop: space[3],
                                marginBottom: space[3]
                            },
                        isMinimal || {
                            position: 'fixed',
                            zIndex: showStickyStatus ? null : -1,
                            transform: `translateY(${showStickyStatus ? '0' : '-200%'})`,
                            transition: 'transform .2s'
                        }
                    ]}
                >
                    <Flex
                        justifyContent='flex-end'
                        marginRight={4}
                        paddingRight={4}
                        borderRight={1}
                        borderColor='gray'
                    >
                        {(() => {
                            switch (biStatus) {
                                case BI_TYPES.ROUGE:
                                    return (
                                        <Image
                                            {...logoProps}
                                            width={isMobile ? 74 : 95}
                                        />
                                    );
                                case BI_TYPES.VIB:
                                    return (
                                        <Image
                                            {...logoProps}
                                            width={isMobile ? 34 : 44}
                                        />
                                    );
                                default:
                                    return (
                                        <Image
                                            {...logoProps}
                                            width={isMobile ? 79 : 103}
                                        />
                                    );
                            }
                        })()}
                    </Flex>
                    <Text fontSize={isMobile || 'lg'}>
                        <b>{this.state.netBeautyBankPointsAvailable.toLocaleString()}</b>
                        {` ${getText('points')}`}
                    </Text>
                </div>
            </React.Fragment>
        );
    };

    renderMinimal = () => {
        const { user } = this.props;

        return Sephora.isMobile() ? (
            this.renderLockup()
        ) : (
            <BiBackground hasGraphic={false}>
                <Box textAlign='center'>
                    <Text
                        is='p'
                        data-at={Sephora.debug.dataAt('qualification greeting')}
                        fontSize='md'
                        fontWeight='bold'
                    >
                        {userUtils.isCelebrationEligible() ? getText('congrats', [user.firstName]) : getText('hi', [user.firstName])}
                    </Text>
                    {this.renderLockup()}
                    {this.renderVIBMessaging()}
                </Box>
            </BiBackground>
        );
    };

    renderFull = () => {
        const { user } = this.props;
        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();
        const biStatus = userUtils.getBiStatus();
        const statusDisplay = userUtils.displayBiStatus(biStatus);

        const logoProps = {
            display: 'block',
            src: `/img/ufe/bi/logo-${statusDisplay.toLowerCase()}.svg`,
            marginX: isDesktop && 'auto',
            height: isMobile ? 32 : 40,
            alt: statusDisplay,
            ['data-at']: Sephora.debug.dataAt('bi_tier_image')
        };

        return (
            <React.Fragment>
                <Box marginBottom={isDesktop && 7}>
                    <BiBackground>
                        {isMobile && (
                            <Box
                                data-at={Sephora.debug.dataAt('show_card_link')}
                                position='absolute'
                                top={0}
                                right={0}
                                padding={3}
                                aria-label={getText('showCard')}
                                onClick={() => this.setState({ showBarcode: true })}
                            >
                                <Image
                                    src='/img/ufe/icons/barcode.svg'
                                    size={24}
                                />
                            </Box>
                        )}
                        {isDesktop && this.renderGreeting()}
                        <LegacyGrid
                            fill={true}
                            gutter={isDesktop && 6}
                            minHeight={isDesktop && 160}
                            alignItems='center'
                        >
                            <LegacyGrid.Cell textAlign={isDesktop && 'center'}>
                                {(() => {
                                    switch (biStatus) {
                                        case BI_TYPES.ROUGE:
                                            return (
                                                <Image
                                                    {...logoProps}
                                                    width={isMobile ? 139 : 173}
                                                />
                                            );
                                        case BI_TYPES.VIB:
                                            return (
                                                <Image
                                                    {...logoProps}
                                                    width={isMobile ? 64 : 80}
                                                />
                                            );
                                        default:
                                            return (
                                                <Image
                                                    {...logoProps}
                                                    width={isMobile ? 149 : 187}
                                                />
                                            );
                                    }
                                })()}
                                <Text
                                    is='p'
                                    marginTop={isMobile ? 2 : 5}
                                    marginBottom={isDesktop && 1}
                                    fontSize={isDesktop && 'md'}
                                >
                                    <b>{this.state.netBeautyBankPointsAvailable.toLocaleString()}</b>
                                    {` ${getText('points')}`}
                                </Text>
                                {this.renderVIBMessaging()}
                            </LegacyGrid.Cell>
                            {isDesktop && <LegacyGrid.Cell>{this.renderSummaryList()}</LegacyGrid.Cell>}
                        </LegacyGrid>
                    </BiBackground>
                    {isMobile && (
                        <LegacyContainer>
                            {this.renderGreeting()}
                            {this.renderSummaryList()}
                        </LegacyContainer>
                    )}
                    {isMobile && !this.props.isMinimal && (
                        <div
                            ref={this.stickyStatusStart}
                            css={{
                                position: 'absolute',
                                marginTop: -(site.headerHeight + STATUS_BAR_HEIGHT),
                                [mediaQueries.sm]: {
                                    marginTop: -(STATUS_BAR_HEIGHT - space[5])
                                }
                            }}
                        />
                    )}
                </Box>
                {isMobile && (
                    <Modal
                        isOpen={this.state.showBarcode}
                        isDrawer={true}
                        onDismiss={() => this.setState({ showBarcode: false })}
                    >
                        <Modal.Header>
                            <Modal.Title>{getText('barcodeTitle')}</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Text
                                is='p'
                                fontSize='md'
                                lineHeight='tight'
                                marginBottom={5}
                                children={getText('barcodeDesc')}
                            />
                            <BiBarcode profileId={user.profileId} />
                        </Modal.Body>
                    </Modal>
                )}
                {isMobile && this.renderLockup()}
            </React.Fragment>
        );
    };

    vibMessagesDataAt = messageIndex => {
        if (messageIndex === 0) {
            return 'bi_tier_info_message';
        } else if (messageIndex === 1) {
            return 'spend_more_message';
        }

        return null;
    };

    renderGreeting = () => {
        const isDesktop = Sephora.isDesktop();

        return (
            <Text
                is='h1'
                lineHeight='tight'
                fontFamily='serif'
                marginTop={isDesktop || 5}
                fontSize={isDesktop ? '2xl' : 'xl'}
                textAlign={isDesktop && 'center'}
                marginBottom={isDesktop ? 6 : 4}
                children={getText('summary')}
            />
        );
    };

    // eslint-disable-next-line complexity
    renderSummaryList = () => {
        const { availableRrcCoupons, isSDUAddedToBasket } = this.state;
        const highestDenomination =
            availableRrcCoupons && availableRrcCoupons.length > 0
                ? availableRrcCoupons.slice().sort((a, b) => b.denomination - a.denomination)[0].denomination
                : null;
        const biSummary = this.props.biSummary || {};
        const currentYear = biSummary.clientSummary && biSummary.clientSummary.currentYear;
        const isYTDSaved = currentYear
            ? (currentYear.dollarsSaved && currentYear.dollarsSaved.value > 0) ||
              (currentYear.rougeRcDollar && currentYear.rougeRcDollar.value > 0) ||
              (currentYear.cashApplied && currentYear.cashApplied.value > 0)
            : false;

        const rewardsTotal = this.state.bankRewards && this.state.bankRewards.rewardsTotal;
        const hasYearAtGlanceLink = currentYear && currentYear.year && (isYTDSaved || rewardsTotal);
        const isUS = localeUtils.isUS();
        const isFrench = localeUtils.isFrench();
        const isSDDRougeFreeShipEligible = userUtils.isSDDRougeFreeShipEligible();
        const activeCampaigns = biSummary.activeCampaigns?.length && biSummary.activeCampaigns;

        const { SDDRougeTestThreshold } = biSummary;
        const isSDDRougeTestV2 = SDDRougeTestThreshold;

        const userSubscriptions = this.props.user?.userSubscriptions || [];
        const isUserSDUTrialEligible = deliveryOptionsUtils.isSDUAllowedForUser(userSubscriptions);

        const showSDDRougeTestV2InfoModal = () => SDDRougeTestV2InfoModal.showModal(this.toggleSDULandingPage, SDDRougeTestThreshold);

        return (
            <>
                {isSDDRougeTestV2 && this.state.renderSDULandingPage && (
                    <SDULandingPageModal
                        isOpen={this.state.renderSDULandingPage}
                        onDismiss={this.toggleSDULandingPage}
                        mediaId={isUS ? SAME_DAY_UNLIMITED_MODAL_US : SAME_DAY_UNLIMITED_MODAL_CA}
                        isSDUAddedToBasket={isSDUAddedToBasket}
                        isUserSDUTrialEligible={isUserSDUTrialEligible}
                        isCanada={!isUS}
                        skipConfirmationModal={true}
                    />
                )}
                {Sephora?.configurationSettings?.isMyOffersModuleEnabled && (
                    <MyOffersLink
                        marginBottom={3}
                        isBlock={true}
                    />
                )}
                {Sephora.configurationSettings.isGamificationEnabled && Sephora.configurationSettings.isGamificationEntryPointsEnabled && (
                    <BiGamificationLink />
                )}
                <Box
                    is='ul'
                    lineHeight='tight'
                    paddingLeft={iconOffset}
                    css={{
                        '& li + li': {
                            borderTopWidth: 1,
                            borderColor: colors.divider,
                            paddingTop: space[2],
                            marginTop: space[2]
                        }
                    }}
                >
                    {activeCampaigns?.length
                        ? activeCampaigns.map((campaign, index) => (
                            <li key={campaign.campaignCode || index}>
                                <Link
                                    {...styles.LIST_ITEMS}
                                    href={`#${campaign.campaignCode}`}
                                >
                                    {!!campaign.campaignImage && (
                                        <Image
                                            data-at={Sephora.debug.dataAt('active_campaign_icon')}
                                            src={`/img/ufe/icons/${campaign.campaignImage}.svg`}
                                            {...styles.IMG_PROPS}
                                        />
                                    )}
                                    <span css={{ flex: 1 }}>
                                        <Markdown content={campaign.alternateSummaryLink} />
                                    </span>
                                </Link>
                            </li>
                        ))
                        : null}
                    {this.state.eligibleForBirthdayGift ? (
                        <li>
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.BIRTHDAY}`}
                            >
                                <Image
                                    data-at={Sephora.debug.dataAt('icon_birthday')}
                                    src='/img/ufe/icons/birthday.svg'
                                    {...styles.IMG_PROPS}
                                />
                                <span
                                    data-at={Sephora.debug.dataAt('birthday_msg')}
                                    css={{ flex: 1 }}
                                    children={getText('birthdayGiftTitle')}
                                />
                            </Link>
                        </li>
                    ) : null}
                    {biSummary.biPercentageOffAvailabilityMessage ? (
                        <li>
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.POINTS_FOR_DISCOUNT}`}
                            >
                                <Image
                                    data-at={Sephora.debug.dataAt('icon_pfd')}
                                    src='/img/ufe/icons/points-discount.svg'
                                    {...styles.IMG_PROPS}
                                />
                                <span
                                    data-at={Sephora.debug.dataAt('pfd_msg')}
                                    css={{ flex: 1 }}
                                >
                                    <Markdown content={replaceDoubleAsterisks(biSummary.biPercentageOffAvailabilityMessage)} />
                                </span>
                            </Link>
                        </li>
                    ) : null}
                    {biSummary.pointMultiplierOptions && biSummary.pointMultiplierOptions.userMultiplier ? (
                        <li>
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.POINTS_MULTIPLIER}`}
                            >
                                <Image
                                    data-at={Sephora.debug.dataAt('icon_pme')}
                                    src='/img/ufe/icons/multiplier.svg'
                                    {...styles.IMG_PROPS}
                                />
                                <span
                                    data-at={Sephora.debug.dataAt('pme_msg')}
                                    css={{ flex: 1 }}
                                >
                                    <Markdown
                                        content={getText('pointsMultiplierText', [biSummary.pointMultiplierOptions.userMultiplier.multiplier])}
                                    />
                                </span>
                            </Link>
                        </li>
                    ) : null}
                    {rewardsTotal && Sephora.fantasticPlasticConfigurations.isGlobalEnabled && isUS ? (
                        <li>
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.CREDIT_CARD_REWARDS}`}
                            >
                                <Image
                                    data-at={Sephora.debug.dataAt('icon_credit_card')}
                                    src='/img/ufe/icons/cc.svg'
                                    {...styles.IMG_PROPS}
                                />
                                <span
                                    data-at={Sephora.debug.dataAt('credit_card_msg')}
                                    css={{ flex: 1 }}
                                    children={getText('bankRewards', [rewardsTotal])}
                                />
                            </Link>
                        </li>
                    ) : null}
                    {highestDenomination && (
                        <li>
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.ROUGE_REWARDS}`}
                            >
                                <Image
                                    data-at={Sephora.debug.dataAt('icon_rouge_rewards')}
                                    src='/img/ufe/icons/rouge-rewards.svg'
                                    {...styles.IMG_PROPS}
                                />
                                <span
                                    data-at={Sephora.debug.dataAt('rouge_rewards_msg')}
                                    css={{ flex: 1 }}
                                >
                                    <Markdown
                                        content={getText('rougeRewardsApply', [isFrench ? `${highestDenomination} $` : `$${highestDenomination}`])}
                                    />
                                </span>
                            </Link>
                        </li>
                    )}
                    {biSummary.biCashBackAvailabilityMessage ? (
                        <li>
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.BI_CASH_BACK}`}
                            >
                                <Image
                                    data-at={Sephora.debug.dataAt('icon_cbr')}
                                    src='/img/ufe/icons/points-cash.svg'
                                    {...styles.IMG_PROPS}
                                />
                                <span
                                    data-at={Sephora.debug.dataAt('cbr_msg')}
                                    css={{ flex: 1 }}
                                >
                                    <Markdown
                                        content={replaceDoubleAsterisks(biSummary.biCashBackAvailabilityMessage)}
                                        data-at={Sephora.debug.dataAt('bi_cash_drop')}
                                    />
                                </span>
                            </Link>
                        </li>
                    ) : null}
                    {biSummary.rewardBazarMessage ? (
                        <li>
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.REWARDS}`}
                            >
                                <Image
                                    data-at={Sephora.debug.dataAt('icon_rewards_bazaar')}
                                    src='/img/ufe/icons/reward-bazaar.svg'
                                    {...styles.IMG_PROPS}
                                />
                                <span
                                    data-at={Sephora.debug.dataAt('rewards_bazaar_msg')}
                                    css={{ flex: 1 }}
                                >
                                    <Markdown
                                        content={replaceDoubleAsterisks(biSummary.rewardBazarMessage)}
                                        data-at={Sephora.debug.dataAt('birb_drop')}
                                    />
                                </span>
                            </Link>
                        </li>
                    ) : null}
                    {hasYearAtGlanceLink ? (
                        <li>
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.YEAR_AT_A_GLANCE}`}
                            >
                                <Image
                                    data-at={Sephora.debug.dataAt('icon_savings')}
                                    src='/img/ufe/icons/saving.svg'
                                    {...styles.IMG_PROPS}
                                />
                                <span
                                    data-at={Sephora.debug.dataAt('savings_msg')}
                                    css={{ flex: 1 }}
                                    children={getText('dollarsSaved', [currentYear.year])}
                                />
                            </Link>
                        </li>
                    ) : null}
                    <li>
                        {isSDDRougeFreeShipEligible || isSDDRougeTestV2 ? (
                            <Link
                                {...styles.LIST_ITEMS}
                                onClick={showSDDRougeTestV2InfoModal}
                            >
                                <Icon
                                    data-at={Sephora.debug.dataAt('icon_shipping')}
                                    name='bag'
                                    {...styles.IMG_PROPS}
                                />
                                <Markdown
                                    data-at={Sephora.debug.dataAt('rouge_member_free_same_day_delivery')}
                                    css={{ flex: 1 }}
                                    content={
                                        isSDDRougeTestV2
                                            ? getText('SDDRougeTestFreeShipping', [SDDRougeTestThreshold])
                                            : getText('rougeMemberFreeSameDayDelivery')
                                    }
                                />
                            </Link>
                        ) : (
                            <Link
                                {...styles.LIST_ITEMS}
                                href={`#${COMPONENT_ID.BI_GRID}`}
                            >
                                <Icon
                                    data-at={Sephora.debug.dataAt('icon_shipping')}
                                    name='truck'
                                    {...styles.IMG_PROPS}
                                />
                                <Markdown
                                    data-at={Sephora.debug.dataAt('shipping_msg')}
                                    css={{ flex: 1 }}
                                    content={getText('freeShip')}
                                />
                            </Link>
                        )}
                    </li>
                </Box>
            </>
        );
    };

    renderVIBMessaging = () => {
        return this.state.realTimeVIBMessages
            ? this.state.realTimeVIBMessages.map((message, index) => {
                return (
                    <Text
                        key={index.toString()}
                        is='p'
                        color={this.props.isMinimal || 'gray'}
                        data-at={Sephora.debug.dataAt(this.vibMessagesDataAt(index))}
                        dangerouslySetInnerHTML={{ __html: message }}
                    />
                );
            })
            : null;
    };

    toggleSDULandingPage = () => {
        this.setState(prevState => ({ renderSDULandingPage: !prevState.renderSDULandingPage }));
    };

    render() {
        const isMobile = Sephora.isMobile();
        const isBIPointsUnavailable = this.props && this.props.isBIPointsUnavailable;

        if (isBIPointsUnavailable) {
            return (
                <LegacyContainer
                    marginTop={isMobile ? 4 : 5}
                    marginBottom={isMobile ? 4 : 6}
                >
                    <BiUnavailable
                        borderRadius={2}
                        justifyContent='center'
                    />
                </LegacyContainer>
            );
        } else {
            return this.props.isMinimal ? this.renderMinimal() : this.renderFull();
        }
    }
}

export default wrapComponent(BiInfoCard, 'BiInfoCard');
