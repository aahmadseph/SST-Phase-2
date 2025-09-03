import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';

import decorators from 'utils/decorators';
import promoUtils from 'utils/Promos';
import cmsApi from 'services/api/cms';
import userUtils from 'utils/User';
import store from 'store/Store';
import Actions from 'Actions';
import BCC from 'utils/BCC';
import localeUtils from 'utils/LanguageLocale';
import urlUtils from 'utils/Url';
import sessionExtensionService from 'services/SessionExtensionService';
import ufeApiService from 'services/api/ufeApi';
import processEvent from 'analytics/processEvent';
import anaConsts from 'analytics/constants';
import creditCardsBindings from 'analytics/bindingMethods/components/richProfile/creditCards/CreditCardsBindings';

import PleaseSignInBlock from 'components/RichProfile/MyAccount/PleaseSignIn';
import BccComponentList from 'components/Bcc/BccComponentList/BccComponentList';
import { colors, space } from 'style/config';
import {
    Box, Flex, Image, Text, Button, Divider, Link
} from 'components/ui';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import dateUtils from 'utils/Date';
import IconCheckmark from 'components/LegacyIcon/IconCheckmark';
import Loves from 'components/Loves';
import SectionDivider from 'components/SectionDivider/SectionDivider';
import termsOfUseConstants from 'constants/TermsOfUse';
import Tooltip from 'components/Tooltip/Tooltip';
import InfoButton from 'components/InfoButton/InfoButton';
import { globalModals, renderModal } from 'utils/globalModals';

const { TERMS_OF_SERVICE } = globalModals;
const { getCallsCounter } = ufeApiService;
const { IMAGE_SIZES } = BCC;
const getText = localeUtils.getLocaleResourceFile('components/RichProfile/CreditCards/locales', 'CreditCards');

/**
 * CONSTANTS
 */
import {
    SEPHORA_CARD_TYPES, LINKS, APPROVAL_STATUS, USER_STATE
} from 'constants/CreditCard';

const { isGlobalEnabled, isCCTEnabled } = Sephora.fantasticPlasticConfigurations;

const MEDIA_IDS = {
    NO_CARD_OR_NO_REWARDS: '49500020',
    BCC_BANNERS: '73400025'
};

const checkForNoBankRewards = bankRewards =>
    !bankRewards || !bankRewards.rewardCertificates || (Array.isArray(bankRewards.rewardCertificates) && !bankRewards.rewardCertificates.length > 0);

class CreditCards extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            userState: null,
            fpdData: null,
            userContent: null,
            bankRewards: {},
            manageCardLink: null,
            carouselChildren: [],
            bccBanners: null
        };
    }

    componentDidMount(user) {
        Sephora.isDesktop() && sessionExtensionService.setExpiryTimer(getCallsCounter());

        if (localeUtils.isCanada() || !isGlobalEnabled || !isCCTEnabled) {
            urlUtils.redirectTo('/');
        } else {
            if (user && user.beautyInsiderAccount) {
                this.userProfileId = user.profileId;
                const biInfo = {
                    ccAccountandPrescreenInfo: user.beautyInsiderAccount.ccAccountandPrescreenInfo,
                    bankRewards: user.bankRewards
                };

                this.setUserState(biInfo);
            } else if (user && !user.beautyInsiderAccount) {
                cmsApi.getMediaContent(MEDIA_IDS.NO_CARD_OR_NO_REWARDS).then(data => {
                    this.setState({
                        userState: USER_STATE.NO_CARD,
                        userContent: data.regions
                    });
                });
            }

            cmsApi.getMediaContent(MEDIA_IDS.BCC_BANNERS).then(data => {
                this.setState({ bccBanners: data.regions });
            });
        }

        // ILLUPH-117700 AC#1
        this.setAnalyticsPageName();
    }

    setAnalyticsPageName = () => {
        digitalData.page.category.pageType = 'user profile';
        digitalData.page.pageInfo.pageName = 'creditcard';
    };

    getManageCardLink = () => {
        const ccType = userUtils.getCreditCardType();

        const cardTypeToLinks = {
            [SEPHORA_CARD_TYPES.PRIVATE_LABEL]: LINKS.MANAGE_CARD.PRIVATE_LABEL,
            [SEPHORA_CARD_TYPES.CO_BRANDED]: LINKS.MANAGE_CARD.CO_BRANDED
        };

        const env = Sephora.UFE_ENV === 'PROD' ? 'PROD' : 'QA';
        const manageCardLink = ccType && cardTypeToLinks[ccType][env];

        this.setState({ manageCardLink });
    };

    /**
     * redirects to basket button handler
     */
    redirectToBasket = () => {
        urlUtils.redirectTo('/basket');
    };

    trackEventAndOpenInNewTab = url => e => {
        e.preventDefault();
        creditCardsBindings.manageMyCard();

        processEvent.process(anaConsts.LINK_TRACKING_EVENT, {
            data: {
                linkName: 'creditcard:manage my card',
                actionInfo: 'creditcard:manage my card'
            }
        });
        urlUtils.openLinkInNewTab(url);
    };

    toggleRewardToBasket = reward => {
        const { bankRewards } = this.state;
        promoUtils.applyPromo(reward.certificateNumber).then(() => {
            this.setState({
                bankRewards: Object.assign({}, bankRewards, {
                    rewardCertificates: bankRewards.rewardCertificates.slice().map(oldReward =>
                        Object.assign({}, oldReward, {
                            isInBasket: oldReward.certificateNumber === reward.certificateNumber ? !oldReward.isInBasket : oldReward.isInBasket
                        })
                    )
                })
            });
        });
    };

    setUserState = biInfo => {
        const ccInfo = biInfo.ccAccountandPrescreenInfo;
        const bankRewards = biInfo.bankRewards;
        const basket = store.getState().basket;
        let fpdInfo = {};

        if (basket && basket.creditCardPromoDetails) {
            fpdInfo = basket.creditCardPromoDetails;
        }

        if (ccInfo.ccApprovalStatus === APPROVAL_STATUS.NEW_APPLICATION || ccInfo.ccApprovalStatus === APPROVAL_STATUS.DECLINED) {
            cmsApi.getMediaContent(MEDIA_IDS.NO_CARD_OR_NO_REWARDS).then(data => {
                this.setState({
                    userState: USER_STATE.NO_CARD,
                    userContent: data.regions
                });
            });
        } else if (ccInfo.ccApprovalStatus === APPROVAL_STATUS.IN_PROGRESS) {
            this.setState({ userState: USER_STATE.IN_PROGRESS });
        } else if (ccInfo.ccApprovalStatus === APPROVAL_STATUS.APPROVED) {
            if (checkForNoBankRewards(bankRewards)) {
                this.setState({
                    userState: USER_STATE.CARD_NO_REWARDS,
                    fpdData: fpdInfo
                });
            } else {
                this.setState({
                    userState: USER_STATE.CARD_AND_REWARDS,
                    bankRewards: bankRewards,
                    fpdData: fpdInfo
                });
            }

            this.getManageCardLink();
        } else if (ccInfo.ccApprovalStatus === APPROVAL_STATUS.CLOSED) {
            this.setState({ userState: USER_STATE.CARD_CLOSED });
        }
    };

    openScanRewardCardModal = () => {
        store.dispatch(Actions.showScanRewardCardModal({ isOpen: true }));
    };

    openMediaModal = () => {
        renderModal(this.props.globalModals[TERMS_OF_SERVICE], () => {
            const mediaId = BCC.MEDIA_IDS.REWARDS_TERMS_AND_CONDITIONS;
            store.dispatch(
                Actions.showMediaModal({
                    isOpen: true,
                    mediaId
                })
            );
        });
    };

    renderRewards = () => {
        const isDesktop = Sephora.isDesktop();
        const isMobile = Sephora.isMobile();

        const availableRewards =
            this.state.bankRewards && this.state.bankRewards.rewardCertificates
                ? this.state.bankRewards.rewardCertificates.filter(reward => reward.available)
                : [];

        const fpdData = this.state.fpdData;

        return (
            <Box paddingX={isDesktop && 4}>
                {((fpdData && fpdData.displayName) || availableRewards.length > 0) && (
                    <React.Fragment>
                        <Text
                            is='h3'
                            marginY={4}
                            fontWeight='bold'
                            textAlign={isDesktop && 'center'}
                            css={{ textTransform: 'uppercase' }}
                            children={getText('rewardsBreakdown')}
                        />
                        <Divider marginY={4} />
                    </React.Fragment>
                )}
                {fpdData && fpdData.displayName && (
                    <React.Fragment>
                        <Flex
                            paddingX={isDesktop ? 4 : 2}
                            alignItems='center'
                            data-at={Sephora.debug.dataAt('cc_reward_item')}
                            justifyContent={isMobile ? 'space-between' : 'center'}
                        >
                            <Text
                                is='p'
                                textAlign={isMobile ? '' : 'center'}
                            >
                                <strong>{fpdData.displayName}</strong>
                                <br />
                                <Text color='gray'>
                                    {getText('expired')} {dateUtils.getDateInMDYFormat(fpdData.couponExpirationDate)}
                                </Text>
                            </Text>
                        </Flex>
                        <Divider marginY={4} />
                    </React.Fragment>
                )}
                {availableRewards.map((reward, index) => (
                    <React.Fragment key={index}>
                        <Flex
                            paddingX={isDesktop ? 4 : 2}
                            alignItems='center'
                            data-at={Sephora.debug.dataAt('cc_reward_item')}
                            justifyContent={isMobile ? 'space-between' : 'center'}
                        >
                            <Text
                                is='p'
                                textAlign={isMobile ? '' : 'center'}
                            >
                                <strong>{`$${reward.rewardAmount}`}</strong> {getText('creditCardReward')}*
                                <br />
                                <Text color='gray'>
                                    {getText('expired')} {reward.expireDate}
                                </Text>
                            </Text>
                            <Box textAlign='right'>
                                {reward.isInBasket ? (
                                    <React.Fragment>
                                        <Flex
                                            fontWeight='bold'
                                            alignItems='center'
                                        >
                                            <IconCheckmark marginRight={2} />
                                            {getText('appliedToBasket')}
                                        </Flex>
                                        <Link
                                            color='blue'
                                            padding={2}
                                            margin={-2}
                                            onClick={() => this.toggleRewardToBasket(reward)}
                                            children={getText('remove')}
                                        />
                                    </React.Fragment>
                                ) : null}
                            </Box>
                        </Flex>
                        <Divider marginY={4} />
                    </React.Fragment>
                ))}
            </Box>
        );
    };

    renderTermsMsg = center => {
        const isMobile = Sephora.isMobile();

        return (
            <Text
                is='p'
                color='gray'
                fontSize='sm'
                marginTop={isMobile ? 3 : 5}
                marginBottom={isMobile || 5}
                marginX={isMobile && 2}
                textAlign={(!isMobile || center) && 'center'}
            >
                {`${termsOfUseConstants.SEPHORA_CARD_EXCLUSIONS} `}
                <Link
                    onClick={this.openMediaModal}
                    color='blue'
                    underline={true}
                    children={termsOfUseConstants.CLICK_HERE_FOR_DETAILS}
                />
            </Text>
        );
    };

    renderInProgressContent = () => {
        const isMobile = Sephora.isMobile();

        return (
            <Box textAlign='center'>
                <Text
                    is='h1'
                    fontFamily='serif'
                    lineHeight='tight'
                    marginTop='2em'
                    fontSize={isMobile ? 'xl' : '2xl'}
                >
                    {getText('underReview')}
                </Text>
                <Image
                    display='block'
                    marginX='auto'
                    marginY={isMobile ? 5 : 6}
                    size={128}
                    alt={getText('decorativeBannerImage')}
                    src='/img/ufe/credit-card/empty-box.svg'
                />
                <Text
                    is='p'
                    fontSize='md'
                    maxWidth='36em'
                    marginX='auto'
                >
                    {getText('reviewMessage')}
                </Text>
            </Box>
        );
    };

    renderClosedContent = () => {
        const isMobile = Sephora.isMobile();

        return (
            <Box textAlign='center'>
                <Text
                    is='h1'
                    fontFamily='serif'
                    lineHeight='tight'
                    marginTop='2em'
                    fontSize={isMobile ? 'xl' : '2xl'}
                >
                    {getText('notActive')}
                </Text>
                <Image
                    display='block'
                    marginX='auto'
                    marginY={isMobile ? 5 : 6}
                    size={128}
                    src='/img/ufe/inactive.svg'
                />
            </Box>
        );
    };

    renderSupportText = () => {
        return (
            <Text
                is='p'
                marginTop={4}
                lineHeight='tight'
                fontSize={Sephora.isDesktop() && 'md'}
                textAlign='center'
            >
                {getText('questions')}
                <br />
                {getText('callCustomerSupport')}{' '}
                <Link
                    color='blue'
                    underline={true}
                    href='tel:1-866-841-5037'
                    children='1 866 841 5037'
                />
                {` | ${getText('ttdTty')} `}
                <Link
                    color='blue'
                    underline={true}
                    href='tel:1-888-819-1918'
                    children='1 888 819 1918'
                />
            </Text>
        );
    };

    renderLovesAndRecs = () => {
        return (
            <React.Fragment>
                <Loves
                    compType={'ApplyCCLoves'}
                    maxLoves={12}
                    compProps={{ imageSize: IMAGE_SIZES[162] }}
                />
            </React.Fragment>
        );
    };

    // eslint-disable-next-line complexity
    render() {
        const isMobile = Sephora.isMobile();
        const isDesktop = Sephora.isDesktop();
        const {
            userState, userContent, bccBanners, manageCardLink, fpdData
        } = this.state;
        const userContentCenter = userContent && userContent.content;
        const bccContentLeft = bccBanners && bccBanners.left;
        const bccContentCenter = bccBanners && bccBanners.content;
        const bccContentRight = bccBanners && bccBanners.right;

        // Earning on next statement module data
        const bankRewards = this.state.bankRewards;
        let nextStatement = null;

        if (bankRewards && bankRewards.totalEarningsOnNextStatement >= 0) {
            nextStatement = {
                totalEarnings: bankRewards.totalEarningsOnNextStatement,
                totalRewardsEarned: bankRewards.totalRewardsEarnedOnNextStatement,
                date: dateUtils.formatDateMDY(bankRewards.nextStatementDate, true, true, false)
            };
        }

        let showDollarSign = true;
        const yearRewards = this.state.bankRewards.YTDRewardsEarned;
        let totalRewardAmount = userUtils.getRewardsAmount(this.state.bankRewards);

        if (totalRewardAmount === 0 && fpdData && fpdData.shortDisplayName) {
            totalRewardAmount = fpdData.shortDisplayName;
            showDollarSign = false;
        }

        const rewardsAmount = !Sephora.isNodeRender ? (totalRewardAmount ? totalRewardAmount : 0) : 0;

        const cardWithRewards = userState === USER_STATE.CARD_AND_REWARDS;
        const cardNoRewards = userState === USER_STATE.CARD_NO_REWARDS;

        return (
            <React.Fragment>
                <LegacyContainer is='main'>
                    {!Sephora.isNodeRender && this.isUserReady() && (
                        <React.Fragment>
                            {this.isUserAtleastRecognized() || <PleaseSignInBlock />}
                            {this.isUserAtleastRecognized() && (
                                <React.Fragment>
                                    {userState === USER_STATE.NO_CARD && userContentCenter && <BccComponentList items={userContentCenter} />}

                                    {userState === USER_STATE.IN_PROGRESS && this.renderInProgressContent()}

                                    {(cardNoRewards || cardWithRewards) && (
                                        <React.Fragment>
                                            <Box
                                                position='relative'
                                                minHeight={isDesktop ? 191 : 204}
                                            >
                                                {bccContentCenter && <BccComponentList items={bccContentCenter} />}
                                                <Box
                                                    position='absolute'
                                                    top={0}
                                                    left={0}
                                                    right={0}
                                                    lineHeight='tight'
                                                    textAlign={isDesktop && 'center'}
                                                >
                                                    <Text
                                                        is='h1'
                                                        fontSize={isDesktop ? '2xl' : 'xl'}
                                                        marginY={isDesktop ? 6 : 5}
                                                        lineHeight='tight'
                                                        fontFamily='serif'
                                                        textAlign='center'
                                                        color='white'
                                                        children={getText('myCardSummary')}
                                                    />
                                                    {manageCardLink ? (
                                                        isDesktop ? (
                                                            <Button
                                                                variant='secondary'
                                                                onClick={this.trackEventAndOpenInNewTab(manageCardLink)}
                                                                hasMinWidth={true}
                                                                color='white'
                                                                children={getText('manageMyCard')}
                                                            />
                                                        ) : (
                                                            <Flex
                                                                justifyContent='center'
                                                                alignItems='center'
                                                            >
                                                                <Divider marginX='-container' />
                                                                <Link
                                                                    display='block'
                                                                    onClick={this.trackEventAndOpenInNewTab(manageCardLink)}
                                                                    paddingY={4}
                                                                    hasFloatingArrow={true}
                                                                    arrowDirection='right'
                                                                    color='white'
                                                                    children={getText('manageMyCard')}
                                                                />
                                                            </Flex>
                                                        )
                                                    ) : null}
                                                </Box>
                                            </Box>
                                            {bccContentLeft && (
                                                <React.Fragment>
                                                    <BccComponentList
                                                        style={{ marginTop: space[2] }}
                                                        items={bccContentLeft}
                                                    />
                                                    {isDesktop && <Divider height={2} />}
                                                </React.Fragment>
                                            )}
                                            <Box
                                                lineHeight='tight'
                                                width='100%'
                                                maxWidth={isDesktop && 746}
                                                marginTop={isDesktop && 6}
                                                marginBottom={isDesktop && 7}
                                                marginX='auto'
                                            >
                                                <LegacyGrid
                                                    gutter={isDesktop && 6}
                                                    justifyContent='center'
                                                >
                                                    <LegacyGrid.Cell width={isDesktop && 'fill'}>
                                                        <Box
                                                            borderRadius={2}
                                                            border={isDesktop && 1}
                                                            borderColor='midGray'
                                                            marginX='auto'
                                                        >
                                                            <Box
                                                                textAlign='center'
                                                                paddingY={isMobile ? 4 : 5}
                                                                paddingX={isMobile ? 6 : 5}
                                                                css={
                                                                    isMobile
                                                                        ? {
                                                                            margin: `0 -${space.container}px ${space[5]}px`,
                                                                            border: `${space[2]}px solid ${colors.lightGray}`
                                                                        }
                                                                        : { borderBottom: `1px solid ${colors.lightGray}` }
                                                                }
                                                            >
                                                                <Text
                                                                    is='h2'
                                                                    fontFamily='serif'
                                                                    marginBottom='.125em'
                                                                    fontSize={isMobile ? 'xl' : '2xl'}
                                                                    children={getText('yourRewards')}
                                                                />
                                                                <Text
                                                                    is='p'
                                                                    fontSize='sm'
                                                                    color='gray'
                                                                >
                                                                    {getText('availableNow')}
                                                                    <Text
                                                                        marginX={2}
                                                                        children='|'
                                                                    />
                                                                    {`${getText('asOf')} ${dateUtils.formatDateMDY(
                                                                        new Date().toISOString(),
                                                                        true,
                                                                        true
                                                                    )}`}
                                                                </Text>
                                                                <Text
                                                                    is='p'
                                                                    lineHeight='none'
                                                                    fontSize={65}
                                                                    fontFamily='serif'
                                                                    marginTop={2}
                                                                    marginLeft='-.25em'
                                                                    marginBottom={isMobile && 4}
                                                                >
                                                                    <Text
                                                                        verticalAlign='super'
                                                                        fontSize='.375em'
                                                                        children={showDollarSign ? '$' : ''}
                                                                    />
                                                                    {rewardsAmount}
                                                                </Text>
                                                                {isMobile && (
                                                                    <Button
                                                                        block={true}
                                                                        variant='secondary'
                                                                        disabled={cardNoRewards || !userUtils.getRewardsAmount(bankRewards)}
                                                                        onClick={this.openScanRewardCardModal}
                                                                    >
                                                                        <Flex
                                                                            is='span'
                                                                            justifyContent='center'
                                                                            alignItems='center'
                                                                        >
                                                                            <Image
                                                                                src='/img/ufe/barcode.svg'
                                                                                width={20}
                                                                                height={16}
                                                                                marginRight={2}
                                                                            />
                                                                            {getText('scanInStore')}
                                                                        </Flex>
                                                                    </Button>
                                                                )}
                                                                <Button
                                                                    block={isMobile}
                                                                    minWidth='22em'
                                                                    variant='primary'
                                                                    marginTop={isMobile ? 2 : 4}
                                                                    onClick={this.redirectToBasket}
                                                                    disabled={rewardsAmount === 0 && Object.keys(fpdData).length === 0}
                                                                    children={getText('applyInBasket')}
                                                                />
                                                                {isMobile && cardNoRewards && this.renderTermsMsg(true)}
                                                            </Box>
                                                            {(cardWithRewards || cardNoRewards) && this.renderRewards()}
                                                            {(isDesktop || cardWithRewards) && this.renderTermsMsg(userState)}
                                                        </Box>
                                                    </LegacyGrid.Cell>
                                                    {(nextStatement || rewardsAmount > 0) && (
                                                        <LegacyGrid.Cell width={isDesktop && 292}>
                                                            {nextStatement && (
                                                                <React.Fragment>
                                                                    {isMobile && <SectionDivider />}
                                                                    <Box
                                                                        textAlign='center'
                                                                        {...(isDesktop && {
                                                                            borderRadius: 2,
                                                                            paddingY: 6,
                                                                            paddingX: 4,
                                                                            marginBottom: 5,
                                                                            border: `1px solid ${colors.midGray}`
                                                                        })}
                                                                    >
                                                                        <Flex
                                                                            justifyContent={isDesktop && 'center'}
                                                                            alignItems='center'
                                                                        >
                                                                            <Text
                                                                                is='h3'
                                                                                fontSize={isDesktop && 'sm'}
                                                                                fontWeight='bold'
                                                                                marginRight='.375em'
                                                                                css={{ textTransform: 'uppercase' }}
                                                                                children={`${getText('available')} ${nextStatement.date}`}
                                                                            />
                                                                            <Tooltip content={getText('availableTime')}>
                                                                                <InfoButton />
                                                                            </Tooltip>
                                                                        </Flex>
                                                                        <Text
                                                                            is='p'
                                                                            fontSize='sm'
                                                                            color='gray'
                                                                            textAlign={isMobile && 'left'}
                                                                        >
                                                                            {getText('earningNextStatement')}
                                                                        </Text>
                                                                        {isDesktop && <Divider marginY={5} />}
                                                                        <Text
                                                                            is='p'
                                                                            lineHeight='none'
                                                                            fontSize={65}
                                                                            fontFamily='serif'
                                                                            marginTop={4}
                                                                            marginLeft='-.25em'
                                                                        >
                                                                            <Text
                                                                                verticalAlign='super'
                                                                                fontSize='.375em'
                                                                                children='$'
                                                                            />
                                                                            {nextStatement.totalEarnings}
                                                                        </Text>
                                                                    </Box>
                                                                </React.Fragment>
                                                            )}
                                                            {rewardsAmount > 0 && (
                                                                <React.Fragment>
                                                                    {isMobile && <SectionDivider />}
                                                                    <Box
                                                                        textAlign='center'
                                                                        {...(isDesktop && {
                                                                            borderRadius: 2,
                                                                            paddingY: 6,
                                                                            paddingX: 4,
                                                                            border: `1px solid ${colors.midGray}`
                                                                        })}
                                                                    >
                                                                        <Text
                                                                            is='h3'
                                                                            fontSize={isDesktop && 'sm'}
                                                                            fontWeight='bold'
                                                                            textAlign={isMobile && 'left'}
                                                                            css={{ textTransform: 'uppercase' }}
                                                                        >
                                                                            {getText('yearToDate')}
                                                                            {isDesktop ? <br /> : ' '}
                                                                            {getText('rewardsEarned')}
                                                                        </Text>
                                                                        {isDesktop && <Divider marginY={5} />}
                                                                        <Text
                                                                            is='p'
                                                                            lineHeight='none'
                                                                            fontSize={65}
                                                                            fontFamily='serif'
                                                                            marginTop={4}
                                                                            marginLeft='-.25em'
                                                                        >
                                                                            <Text
                                                                                verticalAlign='super'
                                                                                fontSize='.375em'
                                                                                children='$'
                                                                            />
                                                                            {yearRewards}
                                                                        </Text>
                                                                    </Box>
                                                                </React.Fragment>
                                                            )}
                                                        </LegacyGrid.Cell>
                                                    )}
                                                </LegacyGrid>
                                            </Box>
                                            {cardNoRewards && this.renderLovesAndRecs()}
                                            {bccContentRight && <BccComponentList items={bccContentRight} />}
                                        </React.Fragment>
                                    )}

                                    {userState === USER_STATE.CARD_CLOSED && this.renderClosedContent()}

                                    {userState === USER_STATE.IN_PROGRESS || this.renderSupportText()}
                                </React.Fragment>
                            )}
                        </React.Fragment>
                    )}
                </LegacyContainer>
            </React.Fragment>
        );
    }
}

export default wrapComponent(decorators.ensureUserIsAtLeastRecognized(CreditCards), 'CreditCards');
