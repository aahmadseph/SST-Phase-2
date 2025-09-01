import React from 'react';
import PropTypes from 'prop-types';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    radii, colors, fontSizes, space
} from 'style/config';

import AccountGreeting from 'components/Header/AccountGreeting';
import {
    Box, Flex, Link, Image, Divider, Text, Icon
} from 'components/ui';
import Markdown from 'components/Markdown/Markdown';
import Dropdown from 'components/Dropdown/Dropdown';
import Avatar from 'components/Avatar';
import MyOffersLink from 'components/MyOffers/MyOffersLink';

/* utils */
import userUtils from 'utils/User';
import localeUtils from 'utils/LanguageLocale';
import anaUtils from 'analytics/utils';
import authUtils from 'utils/Authentication';
import Location from 'utils/Location';
import communityUtils from 'utils/Community';

import anaConsts from 'analytics/constants';
import store from 'store/Store';
import { HydrationFinished } from 'constants/events';

import { APPROVAL_STATUS } from 'constants/CreditCard';
import { URL } from 'constants/Shared';

import NotificationDot from 'components/NotificationDot';
import Badge from 'components/Badge';
import { HEADER_VALUE } from 'constants/authentication';
import helpersUtils from 'utils/Helpers';
import myListsUtils from 'utils/MyLists';
import BuyItAgain from 'components/Header/AccountMenu/BuyItAgain/BuyItAgain';
import MyListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';

const { deferTaskExecution } = helpersUtils;

const {
    PAGE_NAMES: {
        BEAUTY_PREFERENCES,
        BEAUTY_CHALLENGES,
        BEAUTY_INSIDER,
        REWARDS_BAZAAR,
        CREDIT_CARD_SECTION_JOIN,
        PURCHASE_HISTORY,
        ORDERS,
        AUTO_REPLENISH,
        LOVES,
        ACCOUNT_SETTINGS,
        SAME_DAY_UNLIMITED_TRACK,
        BEAUTY_ADVISOR_RECOMMENDATIONS
    },
    EVENT_NAMES: { ME_FLYOUT }
} = anaConsts;

const LINK_PROPS = {
    display: 'flex',
    paddingY: 3,
    paddingX: 4,
    width: '100%',
    hoverSelector: '.Link-target'
};

const ICON_PROPS = {
    size: 24,
    marginRight: 3,
    marginTop: '2px'
};

const BUY_IT_AGAIN_IMAGE_PROPS = {
    size: 48,
    marginRight: 3,
    marginTop: '8px'
};

class AccountMenu extends BaseClass {
    state = {
        isDropOpen: false,
        isAnonymous: null,
        user: {},
        isUserReady: false,
        isBirthdayGiftEligible: null,
        creditCardInfo: null,
        isScrollActive: false,
        showBuyItAgainImages: Sephora.isMobile() && !userUtils.isAnonymous(),
        purchaseHistory: {},
        hasFetchedPurchaseHistory: false,
        hasTriggeredBuyItAgainFetch: false,
        useLocalPurchaseHistory: false
    };

    scrollRef = React.createRef();

    joinBi = e => {
        e.preventDefault();
        this.props.showBiRegisterModal({
            isOpen: true,
            callback: this.props.onDismiss ? this.props.onDismiss : null
        });
    };

    signIn = () => {
        const navInfo = anaUtils.buildNavPath(['top nav', 'account', 'sign-in']);
        deferTaskExecution(() => {
            this.props.showSignInModal({
                isOpen: true,
                analyticsData: { navigationInfo: navInfo },
                source: authUtils.SIGN_IN_SOURCES.ACCOUNT_GREETING,
                extraParams: { headerValue: HEADER_VALUE.USER_CLICK }
            });
        });
    };

    handleDropdownTrigger = (e, isDropdownOpen) => {
        if (this.scrollRef && this.scrollRef.current) {
            this.scrollRef.current.scrollTop = 0;
        }

        this.setState({ isDropOpen: isDropdownOpen });
    };

    handleTriggerClick = () => {
        if (this.state.isAnonymous) {
            this.signIn();
        }
    };

    getAppBottomNavEnabled = () => {
        const navConfig = Sephora.configurationSettings?.appBottomNav;

        return Boolean(navConfig?.isEnabled);
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            isAnonymous, isDropOpen, isScrollActive, showBuyItAgainImages, isUserReady
        } = this.state;
        const { user, localization, showBlackSearchHeader, isAccountMenuBuyItAgain } = this.props;

        const purchaseHistory = this.state.useLocalPurchaseHistory ? this.state.purchaseHistory : this.props.purchaseHistory;

        const showAccountMenuBuyItAgain = isAccountMenuBuyItAgain && !userUtils.isAnonymous() && purchaseHistory.items?.length;
        const beautyInsiderAccount = user && user.beautyInsiderAccount;
        const biPoints = (beautyInsiderAccount && beautyInsiderAccount.promotionPoints) || 0;
        const biStatus = beautyInsiderAccount && userUtils.displayBiStatus(beautyInsiderAccount.vibSegment);
        const userFirstName = user?.firstName ?? beautyInsiderAccount?.firstName;
        const userLastName = user?.lastName ?? beautyInsiderAccount?.lastName;

        const menu = this.renderMenu({
            biPoints,
            biStatus,
            showBuyItAgainImages,
            purchaseHistory,
            showAccountMenuBuyItAgain
        });

        const logoSrc = beautyInsiderAccount && `/img/ufe/bi/logo-${biStatus.toLowerCase()}${showBlackSearchHeader ? '-white' : ''}.svg`;
        const dropdownStyle = !isUserReady ? { visibility: 'hidden' } : { visibility: 'visible' };
        const avatarStyle = !isDropOpen && isAnonymous && !showBlackSearchHeader ? { opacity: 0.6 } : null;
        const spanStyle = isDropOpen ? { boxShadow: `0 2px 0 0 ${showBlackSearchHeader ? colors.white : colors.black}` } : null;
        const boxStyle = isScrollActive ? { borderBottom: `1px solid ${colors.lightGray}` } : null;

        if (!this.props.dropWidth) {
            return menu;
        } else {
            return (
                <Dropdown
                    id='account_drop'
                    hasCustomScroll={true}
                    hasMaxHeight={true}
                    height='100%'
                    style={dropdownStyle}
                    onTrigger={this.handleDropdownTrigger}
                >
                    <Dropdown.Trigger
                        display='flex'
                        alignItems='center'
                        paddingX={4}
                        lineHeight='tight'
                        height='100%'
                        minWidth='13em'
                        onClick={this.handleTriggerClick}
                    >
                        <Avatar
                            {...(isAnonymous && {
                                src: `/img/ufe/icons/me${isDropOpen || showBlackSearchHeader ? '-active' : '32'}.svg`
                            })}
                            marginY={-1}
                            marginRight={3}
                            size={32}
                            isOutlined={isDropOpen}
                            style={avatarStyle}
                        />
                        <span style={spanStyle}>
                            {user && userFirstName ? (
                                <>
                                    {localization.greeting},{' '}
                                    {userFirstName.length > 8 ? `${userFirstName.charAt(0)}.${userLastName.charAt(0)}.` : userFirstName}
                                    <NotificationDot
                                        marginTop='-1px'
                                        marginLeft='1px'
                                    />
                                    {beautyInsiderAccount ? (
                                        <Text
                                            fontSize='sm'
                                            display='block'
                                        >
                                            <Image
                                                src={logoSrc}
                                                alt={biStatus}
                                                height='.725em'
                                            />{' '}
                                            <strong>{biPoints.toLocaleString()}</strong> pt{biPoints !== 1 ? 's' : ''}
                                        </Text>
                                    ) : null}
                                </>
                            ) : (
                                <>
                                    <Text
                                        fontSize='sm'
                                        fontWeight='bold'
                                        display='block'
                                        data-at={Sephora.debug.dataAt('sign_in_header')}
                                    >
                                        {localization.signIn}
                                        <NotificationDot
                                            marginTop='-1px'
                                            marginLeft='1px'
                                        />
                                    </Text>
                                    <Text
                                        fontSize='xs'
                                        display='block'
                                    >
                                        {localization.signInPrompt} 🚚
                                    </Text>
                                </>
                            )}
                        </span>
                    </Dropdown.Trigger>
                    <Dropdown.Menu
                        width={this.props.dropWidth + (showAccountMenuBuyItAgain ? 315 : 0)}
                        align='center'
                        paddingTop={4}
                        css={styles.dropdown}
                        additionalLeftMargin={showAccountMenuBuyItAgain ? 400 : 0}
                    >
                        {Boolean(showAccountMenuBuyItAgain) && (
                            <BuyItAgain
                                purchaseHistory={purchaseHistory}
                                localization={localization}
                                onDismiss={this.props.onDismiss}
                            />
                        )}
                        <span>
                            <Box
                                paddingX={4}
                                paddingBottom={2}
                                style={boxStyle}
                            >
                                <AccountGreeting />
                            </Box>
                            <Box
                                paddingTop={1}
                                paddingBottom={4}
                                lineHeight='tight'
                                overflowY='auto'
                                onScroll={this.handleScroll}
                                ref={this.scrollRef}
                            >
                                {menu}
                            </Box>
                        </span>
                    </Dropdown.Menu>
                </Dropdown>
            );
        }
    }

    handleScroll = () => {
        const refData = this.scrollRef && this.scrollRef.current;
        const { isScrollActive } = this.state;

        if (refData && refData.scrollTop > 0) {
            !isScrollActive &&
                this.setState({
                    isScrollActive: true
                });
        } else {
            isScrollActive &&
                this.setState({
                    isScrollActive: false
                });
        }
    };

    handleBeautyPreferencesClick = e => {
        this.trackNavClick(BEAUTY_PREFERENCES);
        const href = e?.currentTarget?.getAttribute('href');

        if (href) {
            Location.navigateTo(e, href);
        }
    };

    handleBeautyInsiderClick = () => {
        this.trackNavClick(BEAUTY_INSIDER);
    };

    handleRewardsBazaarClick = () => {
        this.trackNavClick(REWARDS_BAZAAR);
    };

    handleCreditCardClick = () => {
        this.trackNavClick(CREDIT_CARD_SECTION_JOIN);
    };

    handleBeautyChallengesClick = e => {
        this.trackNavClick(BEAUTY_CHALLENGES);
        Location.navigateTo(e, '/beauty/challenges');
        this.props.onDismiss();
    };

    handlePurchaseHistoryClick = () => {
        this.trackNavClick(PURCHASE_HISTORY);
    };

    handelOrdersClick = () => {
        this.trackNavClick(ORDERS);
    };

    handleAutoReplenishClick = () => {
        this.trackNavClick(AUTO_REPLENISH);
    };

    handleLovesClick = event => {
        this.trackNavClick(LOVES);
        const href = event?.currentTarget?.getAttribute('href');

        if (href) {
            Location.navigateTo(event, href);
        }
    };

    handleAccountSettingsClick = () => {
        this.trackNavClick(ACCOUNT_SETTINGS);
    };

    handleSameDayUnlimitedClick = () => {
        this.trackNavClick(SAME_DAY_UNLIMITED_TRACK);
    };

    handleBeautyAdvisorRecommendationsClick = () => {
        this.trackNavClick(BEAUTY_ADVISOR_RECOMMENDATIONS);
    };

    /* eslint-disable-next-line complexity */
    renderMenu = ({
        biPoints, biStatus, showBuyItAgainImages, purchaseHistory, showAccountMenuBuyItAgain
    }) => {
        const { isAnonymous, creditCardInfo, isBirthdayGiftEligible } = this.state;
        const { user, localization, isSmallView } = this.props;
        const { biCashLockUpMsg, beautyInsiderAccount, ccRewards } = user;
        const { bankRewards } = ccRewards ?? {};
        const ccRewardsAmount = userUtils.getRewardsAmount(bankRewards);
        const isUserSignedInRecognized = userUtils.isSignedIn() || userUtils.isRecognized();
        const sameDayUnlimitedSubscription = user.userSubscriptions?.filter(
            subscription => subscription.type === 'SDU' && subscription.status === 'ACTIVE'
        );
        // Calculate the subscription count; if sameDayUnlimitedSubscription is undefined, default the count to 0.
        const subscriptionCount = sameDayUnlimitedSubscription?.length ?? 0;
        const isSDUMember = isUserSignedInRecognized && subscriptionCount > 0;
        const isSDUNonMember = isUserSignedInRecognized && subscriptionCount === 0;
        const SDUUrl = isSDUMember ? '/profile/MyAccount/SameDayUnlimited' : '/product/subscription-same-day-unlimited-P483900';
        const isMyOffersModuleEnabled = Sephora?.configurationSettings?.isMyOffersModuleEnabled;
        const hasBINotifications = isBirthdayGiftEligible || biCashLockUpMsg || isMyOffersModuleEnabled;
        const hasAutoReplenishSubscriptions =
            Array.isArray(user.subscriptionSummary) &&
            user.subscriptionSummary?.some(subscription => subscription.type === 'REPLENISHMENT' && (subscription.active || subscription.paused));
        const showAutoReplenishDescWithSubs = (isUserSignedInRecognized && hasAutoReplenishSubscriptions) || false;
        const isAutoReplenishEmptyHubEnabled = Sephora.configurationSettings.isAutoReplenishEmptyHubEnabled || false;
        //removed progress bar for now
        // const progressBarStyle = {
        //     width: `${profileCompletionPercentage}%`
        // };

        const isAppBottom = this.getAppBottomNavEnabled();

        const descStyle = {
            marginTop: '.375em'
        };
        const emptyStyle = {
            '&:empty': { display: 'none' }
        };
        const isSharableListEnabled = myListsUtils.isSharableListEnabled();

        return this.state.isUserReady ? (
            <>
                <Divider />
                <Link
                    href='/profile/BeautyPreferences'
                    onClick={this.handleBeautyPreferencesClick}
                    {...LINK_PROPS}
                >
                    <div css={styles.linkInner}>
                        <Flex alignItems='center'>
                            <Image
                                src='/img/ufe/icons/beauty-traits.svg'
                                size={24}
                                marginRight={2}
                            />
                            <div
                                className='Link-target'
                                children={localization.beautyPrefHeading}
                            />
                            {/* BP Flyout progress bar, we will implement it again in scope of another Jira */}
                            {/* <Box
                                backgroundColor='lightGray'
                                borderRadius={2}
                                overflow='hidden'
                                height={9}
                                width='36.75%'
                                marginLeft='auto'
                            >
                                <Box
                                    backgroundColor='green'
                                    height='100%'
                                    style={progressBarStyle}
                                />
                            </Box> */}
                        </Flex>
                        <div css={[styles.desc, descStyle]}>{localization.guidedSellingBeautyPrefDesc}</div>
                    </div>
                </Link>
                <Divider />
                {beautyInsiderAccount ? (
                    <Link
                        href='/profile/BeautyInsider'
                        onClick={this.handleBeautyInsiderClick}
                        {...LINK_PROPS}
                    >
                        <div
                            css={styles.linkInner}
                            data-at={Sephora.debug.dataAt('rb_link_text')}
                        >
                            <div className='Link-target'>{localization.biHeading}</div>
                            <div
                                css={styles.desc}
                                className='Link-target'
                            >
                                {localization.biDesc}
                            </div>
                            {isBirthdayGiftEligible && (
                                <div
                                    css={styles.pill}
                                    data-at={Sephora.debug.dataAt('rb_birth_text')}
                                >
                                    {localization.chooseBirthdayGift}
                                </div>
                            )}
                            {biCashLockUpMsg && (
                                <div css={styles.pill}>
                                    <Markdown
                                        content={biCashLockUpMsg.replace(/\*{2}/g, '*')}
                                        data-at={Sephora.debug.dataAt('cbr_message')}
                                    />
                                </div>
                            )}
                            {isMyOffersModuleEnabled && (
                                <Box
                                    marginTop={1}
                                    fontSize='sm'
                                    css={emptyStyle}
                                >
                                    <MyOffersLink
                                        onDismiss={this.props.onDismiss}
                                        data-at={Sephora.debug.dataAt('view_exclusive_offers_link')}
                                    />
                                </Box>
                            )}
                        </div>
                        <Image
                            display='inline-block'
                            data-at={Sephora.debug.dataAt('bi_logo')}
                            src={`/img/ufe/bi/logo-${biStatus.toLowerCase()}.svg`}
                            alt={biStatus}
                            height={12}
                            {...(!hasBINotifications && { marginY: 'auto' })}
                            {...(hasBINotifications && { marginTop: 3 })}
                        />
                    </Link>
                ) : (
                    <Link
                        href='/profile/BeautyInsider'
                        onClick={!isAnonymous ? this.joinBi : null}
                        {...LINK_PROPS}
                    >
                        <div
                            css={styles.linkInner}
                            data-at={Sephora.debug.dataAt('rb_link_text')}
                        >
                            <div className='Link-target'>{localization.biHeading}</div>
                            <div
                                css={styles.desc}
                                className={isAnonymous ? 'Link-target' : null}
                            >
                                {localization.biDesc}
                            </div>
                        </div>
                        {isAnonymous ? (
                            <Image
                                display='block'
                                src='/img/ufe/bi/logo-insider.svg'
                                alt='Beauty Insider'
                                height={12}
                                marginY='auto'
                            />
                        ) : (
                            <Text
                                color='blue'
                                fontSize='sm'
                                className='Link-target'
                            >
                                {localization.joinNow}
                            </Text>
                        )}
                    </Link>
                )}
                <Divider />
                <Link
                    href='/rewards'
                    onClick={this.handleRewardsBazaarClick}
                    {...LINK_PROPS}
                >
                    <div
                        css={styles.linkInner}
                        data-at={Sephora.debug.dataAt('rb_link_text')}
                    >
                        <div className='Link-target'>{localization.rewardsHeading}</div>
                        <div css={styles.desc}>{localization.rewardsDesc}</div>
                    </div>
                    <Flex
                        flexDirection='column'
                        alignItems='end'
                    >
                        <strong>{`${biPoints.toLocaleString()} `}</strong>
                        <span>
                            {localization.pointsLabel}
                            {biPoints !== 1 ? 's' : ''}
                        </span>
                    </Flex>
                </Link>
                {this.isCreditCardEnabled() && creditCardInfo && creditCardInfo.ccApprovalStatus === APPROVAL_STATUS.APPROVED ? (
                    <>
                        <Divider />
                        <Link
                            href='/profile/CreditCard'
                            onClick={this.handleCreditCardClick}
                            {...LINK_PROPS}
                        >
                            <div className='Link-target'>
                                {localization.ccHeading}
                                {bankRewards && (
                                    <>
                                        <b> • </b>
                                        <span>
                                            <strong>{`$${ccRewardsAmount} `}</strong>
                                            {localization.ccRewardsLabel}
                                        </span>
                                    </>
                                )}
                            </div>
                            <div
                                css={styles.desc}
                                className='Link-target'
                            >
                                {localization.ccDesc}
                            </div>
                        </Link>
                    </>
                ) : null}
                {Sephora.configurationSettings.isGamificationEnabled && (
                    <>
                        <Divider />
                        <Link
                            href='/beauty/challenges'
                            className='ActionableTarget'
                            onClick={this.handleBeautyChallengesClick}
                            {...LINK_PROPS}
                        >
                            <div css={styles.linkInner}>
                                <div className='Link-target'>
                                    <Flex>
                                        <p>{localization.beautyChallenges}</p>
                                        <Box marginLeft={2}>
                                            <Badge
                                                badge={localization.new}
                                                color={colors.black}
                                            />
                                        </Box>
                                    </Flex>
                                </div>
                                <div css={[styles.desc]}>{localization.beautyChallengesDescription}</div>
                            </div>
                        </Link>
                    </>
                )}
                <Divider thick={true} />
                <Link
                    href='/purchase-history'
                    onClick={this.handlePurchaseHistoryClick}
                    {...LINK_PROPS}
                >
                    <Image
                        src='/img/ufe/icons/subscription.svg'
                        {...ICON_PROPS}
                    />
                    <div css={styles.linkInner}>
                        <div className='Link-target'>{localization.purchasesHeading}</div>
                        <div css={styles.desc}>{localization.purchasesDesc}</div>
                        {showBuyItAgainImages && !showAccountMenuBuyItAgain && this.renderBuyItAgainImages()}
                    </div>
                </Link>
                {Boolean(showAccountMenuBuyItAgain) && isSmallView && (
                    <BuyItAgain
                        purchaseHistory={purchaseHistory}
                        localization={localization}
                        isSmallView={true}
                        onDismiss={this.props.onDismiss}
                    />
                )}
                <Divider />
                <Link
                    href='/profile/MyAccount/Orders'
                    onClick={this.handelOrdersClick}
                    {...LINK_PROPS}
                >
                    <Image
                        src='/img/ufe/icons/track.svg'
                        {...ICON_PROPS}
                    />
                    <div css={styles.linkInner}>
                        <div className='Link-target'>{localization.ordersHeading}</div>
                        <div css={styles.desc}>{localization.ordersDesc}</div>
                    </div>
                </Link>
                <Divider />
                <Link
                    href='/profile/MyAccount/AutoReplenishment'
                    onClick={this.handleAutoReplenishClick}
                    {...LINK_PROPS}
                >
                    <Image
                        src='/img/ufe/icons/auto-replenish.svg'
                        {...ICON_PROPS}
                    />
                    <div css={styles.linkInner}>
                        <div
                            className='Link-target'
                            children={localization.autoReplenishHeading}
                        />
                        <div
                            data-at={Sephora.debug.dataAt('auto-replenish-description')}
                            css={styles.desc}
                        >
                            {!isAutoReplenishEmptyHubEnabled || showAutoReplenishDescWithSubs
                                ? localization.autoReplenishDescWithSubs
                                : localization.autoReplenishDesc}
                        </div>
                    </div>
                </Link>
                <Divider />
                {isSharableListEnabled
                    ? this.renderMyListTextAndLink('/profile/Lists', localization.myListsHeading, localization.myListsDesc)
                    : this.renderMyListTextAndLink('/shopping-list', localization.lovesHeading, localization.lovesDesc)}
                <Divider />
                {this.renderCommunityMenuOption()}
                <Link
                    href='/profile/MyAccount'
                    onClick={this.handleAccountSettingsClick}
                    {...LINK_PROPS}
                >
                    <Image
                        src='/img/ufe/icons/account.svg'
                        {...ICON_PROPS}
                    />
                    <div css={styles.linkInner}>
                        <div className='Link-target'>{localization.accountHeading}</div>
                        <div css={styles.desc}>{localization.accountDesc}</div>
                    </div>
                </Link>
                {this.isCreditCardEnabled() &&
                (isAnonymous || !userUtils.isBI() || (creditCardInfo && creditCardInfo.ccApprovalStatus !== APPROVAL_STATUS.APPROVED)) ? (
                        <>
                            <Divider />
                            <Link
                                href='/profile/CreditCard'
                                onClick={this.handleCreditCardClick}
                                {...LINK_PROPS}
                            >
                                <Image
                                    src='/img/ufe/icons/cc-outline.svg'
                                    {...ICON_PROPS}
                                />
                                <div css={styles.linkInner}>
                                    <div className='Link-target'>{localization.ccHeading}</div>
                                    <div css={styles.desc}>{localization.ccApplyNow}</div>
                                </div>
                            </Link>
                        </>
                    ) : null}
                <Divider
                    color='nearWhite'
                    height={3}
                />
                <>
                    <Link
                        onClick={this.handleSameDayUnlimitedClick}
                        href={SDUUrl}
                        {...LINK_PROPS}
                    >
                        <Icon
                            name='bag'
                            {...ICON_PROPS}
                        />
                        <div css={styles.linkInner}>
                            <div className='Link-target'>{localization.sameDayUnlimitedHeading}</div>
                            <div css={styles.desc}>
                                {
                                    localization[
                                        isSDUMember
                                            ? 'sameDayUnlimitedMemberDesc'
                                            : isSDUNonMember
                                                ? 'subscribeToday'
                                                : 'sameDayUnlimitedNonMemberDesc'
                                    ]
                                }
                            </div>
                        </div>
                    </Link>
                    <Divider />
                </>
                <Link
                    onClick={this.handleOnTrackNavClick('reservations', '/happening/reservations')}
                    {...LINK_PROPS}
                >
                    <Image
                        src='/img/ufe/icons/reservations.svg'
                        {...ICON_PROPS}
                    />
                    <div css={styles.linkInner}>
                        <div className='Link-target'>{localization.reservationsHeading}</div>
                        <div css={styles.desc}>{localization.reservationsDesc}</div>
                    </div>
                </Link>
                <Divider />
                <Link
                    href='/in-store-services'
                    onClick={this.handleBeautyAdvisorRecommendationsClick}
                    {...LINK_PROPS}
                >
                    <Image
                        src='/img/ufe/icons/recommendations.svg'
                        {...ICON_PROPS}
                    />
                    <div css={styles.linkInner}>
                        <div className='Link-target'>{localization.recHeading}</div>
                        <div css={styles.desc}>{localization.recDesc}</div>
                    </div>
                </Link>
                {isAppBottom && (
                    <>
                        <Divider />
                        <Link
                            href={URL.COMMUNITY_GALLERY}
                            {...LINK_PROPS}
                        >
                            <Icon
                                name='gallery'
                                {...ICON_PROPS}
                            />
                            <div css={styles.linkInner}>
                                <div className='Link-target'>{localization.galleryHeading}</div>
                                <div css={styles.desc}>{localization.galleryDesc}</div>
                            </div>
                        </Link>
                    </>
                )}
                {isAnonymous || (
                    <>
                        <Divider />
                        <Link
                            {...LINK_PROPS}
                            hoverSelector={null}
                            data-at={Sephora.debug.dataAt('sign_out_button')}
                            onClick={this.signOutHandler}
                        >
                            {localization.signOut}
                        </Link>
                    </>
                )}
            </>
        ) : null;
    };

    renderMyListTextAndLink = (href, heading, description) => {
        return (
            <Link
                href={href}
                onClick={this.handleLovesClick}
                {...LINK_PROPS}
            >
                <Image
                    src='/img/ufe/icons/heart.svg'
                    {...ICON_PROPS}
                />
                <div css={styles.linkInner}>
                    <div className='Link-target'>{heading}</div>
                    <div css={styles.desc}>{description}</div>
                </div>
            </Link>
        );
    };

    renderCommunityMenuOption = () => {
        const { isShopYourStoreEnabled, isBottomNav, localization } = this.props;

        if (!isShopYourStoreEnabled || isBottomNav) {
            return null;
        }

        const communityLink = communityUtils.getCommunityUrl();

        return (
            <>
                <Link
                    href={communityLink}
                    {...LINK_PROPS}
                >
                    <Icon
                        name='community'
                        {...ICON_PROPS}
                    />
                    <div css={styles.linkInner}>
                        <div className='Link-target'>{localization.communityHeading}</div>
                        <div css={styles.desc}>{localization.communityDesc}</div>
                    </div>
                </Link>
                <Divider />
            </>
        );
    };

    getFirstSkuImage = skuImages => {
        for (const key in skuImages) {
            if (Object.prototype.hasOwnProperty.call(skuImages, key)) {
                return skuImages[key];
            }
        }

        return null;
    };

    renderBuyItAgainImages = () => {
        const { purchaseHistory: propsPurchaseHistory } = this.props;
        const { purchaseHistory: statePurchaseHistory } = this.state;
        const purchaseHistory = propsPurchaseHistory || statePurchaseHistory;

        return (
            Array.isArray(purchaseHistory.items) && (
                <Flex flexDirection='row'>
                    {purchaseHistory.items.map(product => (
                        <Box key={product.sku.skuId}>
                            <Image
                                src={this.getFirstSkuImage(product.sku.skuImages)}
                                disableLazyLoad
                                {...BUY_IT_AGAIN_IMAGE_PROPS}
                            />
                        </Box>
                    ))}
                </Flex>
            )
        );
    };

    signOutHandler = () => {
        let redirectTo = window.location.href;

        // This should be read as: users that sign out while on Rich Profile pages,
        // should always get landed onto the homepage.
        if (
            (Sephora.pagePath && Sephora.pagePath.split('/')[1] === 'RichProfile' && Sephora.pagePath.split('/')[2] !== 'PurchaseHistory') ||
            Location.isRwdCreditCardPage() ||
            Location.isBIPage()
        ) {
            redirectTo = '/';
        }

        this.props.signOut(redirectTo, false, false, undefined, `manual logout from account menu: ${window.location.pathname}`);
        this.trackNavClick('sign out');
    };

    handleOnTrackNavClick = (navClickArg, targetUrl) => () => {
        this.trackNavClick(navClickArg);
        Location.navigateTo(null, targetUrl);
    };

    trackNavClick = link => {
        const { isBottomNav, localization, user } = this.props;
        const path = [isBottomNav ? 'bottom nav' : 'top nav', 'account', link];
        const isSharableListEnabled = myListsUtils.isSharableListEnabled();
        const analyticsData = {
            navigationInfo: anaUtils.buildNavPath(path)
        };

        if (link === BEAUTY_PREFERENCES) {
            analyticsData.isMySephoraPage = true;
        } else if (link === BEAUTY_CHALLENGES) {
            analyticsData.linkData = `gamification:flyout:${localization.beautyChallenges.toLowerCase()}`;
        } else if (link === BEAUTY_INSIDER) {
            analyticsData.linkData = ME_FLYOUT.BEAUTY_INSIDER_SUMMARY;

            if (user?.biCashLockUpMsg) {
                analyticsData.internalCampaign = user.biCashLockUpMsg.toLowerCase();
            }
        }

        if (isSharableListEnabled) {
            MyListsBindings.setFlyoutNextPage();
        } else {
            anaUtils.setNextPageData(analyticsData);
        }
    };

    isCreditCardEnabled = () => {
        const { isAnonymous, creditCardInfo } = this.state;
        const isGlobalEnabled = Sephora.fantasticPlasticConfigurations.isGlobalEnabled;

        return (
            !localeUtils.isCanada() &&
            isGlobalEnabled &&
            (!userUtils.isBI() ||
                (creditCardInfo &&
                    creditCardInfo.ccApprovalStatus !== APPROVAL_STATUS.DECLINED &&
                    creditCardInfo.ccApprovalStatus !== APPROVAL_STATUS.CLOSED) ||
                isAnonymous)
        );
    };

    setUserInfoState = () => {
        const { user, auth } = this.props;

        this.setState({
            isUserReady: true,
            isAnonymous: userUtils.isAnonymous(auth),
            isBirthdayGiftEligible: userUtils.isBirthdayGiftEligible(user),
            creditCardInfo: userUtils.getSephoraCreditCardInfo(user)
        });
    };

    openSignInModal = () => {
        store.dispatch(
            this.props.showSignInModal({
                isOpen: true,
                callback: ({ tokens }) => {
                    this.props.updateProfileStatus({
                        profileSecurityStatus: [tokens.profileSecurityStatus],
                        accessToken: [tokens.accessToken, tokens.atExp],
                        refreshToken: [tokens.refreshToken, tokens.rtExp]
                    });
                    this.props.getUserFull();
                }
            })
        );
    };

    handlePurchaseHistoryFetch = showBuyItAgainLogic => {
        const { user, isAccountMenuBuyItAgain } = this.props;
        const { showBuyItAgainImages, hasFetchedPurchaseHistory } = this.state;
        const shouldFetch = showBuyItAgainImages || (isAccountMenuBuyItAgain && !userUtils.isAnonymous());

        if (!shouldFetch || hasFetchedPurchaseHistory) {
            return;
        }

        this.props
            .fetchPurchaseHistory(
                { userId: user.profileId, requiredData: { purchaseHistory: {} } },
                showBuyItAgainImages,
                showBuyItAgainLogic,
                isAccountMenuBuyItAgain
            )
            .then(() => {
                const updatedPurchaseHistory = this.props.purchaseHistory;

                if (Array.isArray(updatedPurchaseHistory?.items) && updatedPurchaseHistory.items.length > 0) {
                    this.setState({
                        purchaseHistory: updatedPurchaseHistory,
                        hasFetchedPurchaseHistory: true,
                        useLocalPurchaseHistory: true
                    });
                }
            });
    };

    componentDidMount() {
        if (this.props.user?.isInitialized) {
            this.setUserInfoState();
        }

        if (this.props.isAccountMenuBuyItAgain && !this.state.hasTriggeredBuyItAgainFetch) {
            this.setState({ hasTriggeredBuyItAgainFetch: true }, () => {
                this.handlePurchaseHistoryFetch(this.props.showBuyItAgainLogic);
            });
        }

        const onLastLoadEvent = Sephora.Util.onLastLoadEvent;

        onLastLoadEvent(window, [HydrationFinished], () => {
            window.addEventListener('promptUserToSignIn', () => {
                this.openSignInModal();
            });
        });
    }

    componentDidUpdate(prevProps) {
        const { user } = this.props;

        if (user && user !== prevProps.user && user.isInitialized) {
            this.setUserInfoState();
        }

        if (this.props.isAccountMenuBuyItAgain && !prevProps.isAccountMenuBuyItAgain && !this.state.hasTriggeredBuyItAgainFetch) {
            this.setState({ hasTriggeredBuyItAgainFetch: true }, () => {
                this.handlePurchaseHistoryFetch(this.props.showBuyItAgainLogic);
            });
        }
    }

    componentWillUnmount() {
        window.removeEventListener('promptUserToSignIn', this.openSignInModal);
    }
}

AccountMenu.propTypes = {
    user: PropTypes.object.isRequired,
    localization: PropTypes.object.isRequired,
    profileCompletionPercentage: PropTypes.number.isRequired,
    onDismiss: PropTypes.func,
    isBottomNav: PropTypes.bool,
    showSignInModal: PropTypes.func.isRequired,
    showBiRegisterModal: PropTypes.func.isRequired,
    signOut: PropTypes.func.isRequired,
    getUserFull: PropTypes.func.isRequired,
    dropWidth: PropTypes.number
};

AccountMenu.defaultProps = {
    onDismiss: null,
    isBottomNav: false,
    dropWidth: null
};

const styles = {
    desc: {
        fontSize: fontSizes.sm,
        color: colors.gray,
        marginTop: '.125em'
    },
    linkInner: {
        flex: 1,
        alignSelf: 'center',
        display: 'flex',
        flexDirection: 'column'
    },
    pill: {
        display: 'inline-block',
        padding: '.25em .625em',
        marginTop: space[1],
        marginRight: 'auto',
        borderRadius: radii[2],
        backgroundColor: colors.lightBlue,
        fontSize: fontSizes.sm
    },
    dropdown: {
        display: 'flex',
        flexDirection: 'row'
    }
};

export default wrapComponent(AccountMenu, 'AccountMenu', true);
