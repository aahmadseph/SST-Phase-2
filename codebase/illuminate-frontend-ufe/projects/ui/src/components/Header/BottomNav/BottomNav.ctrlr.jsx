/* eslint-disable class-methods-use-this */

/* eslint-disable no-unused-expressions */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    breakpoints, colors, fontSizes, fontWeights, mediaQueries
} from 'style/config';

import { Icon, Box } from 'components/ui';
import Avatar from 'components/Avatar';
import Popover from 'components/Popover/Popover';
import AccountModal from 'components/Header/AccountModal/AccountModal';
import CommunityModal from 'components/Header/CommunityModal/CommunityModal.f';
import ShopModal from 'components/Header/ShopModal/ShopModal';
import StoresModal from 'components/Header/StoresModal/StoresModal';
import MyStoreModal from 'components/ShopYourStore/MyStoreModal';

/* utils */
import urlUtils from 'utils/Url';
import anaUtils from 'analytics/utils';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import { css, Global } from '@emotion/react';
import Storage from 'utils/localStorage/Storage';
import localeUtils from 'utils/LanguageLocale';
import Location from 'utils/Location';
import sysUtils from 'utils/ShopYourStore';
import NotificationDot from 'components/NotificationDot';
import { DebouncedResize, DebouncedScroll } from 'constants/events';
import { NEW_BADGE } from 'constants/ShopYourStore';
import Action from 'components/Content/Action';
import BottomNavButton from 'components/BottomNavButton';

const ActionBottomNavButton = Action(BottomNavButton);

const HEIGHT = [66, 86];
const ICON_SIZE = [24, 30];

const ITEMS = {
    HOME: 'home',
    SHOP: 'shop',
    OFFERS: 'offers',
    ME: 'me',
    COMMUNITY: 'community',
    STORES: 'store',
    MY_STORE: 'myStore',
    BOTTOM_NAV: 'bottomNav'
};

const { getLink } = urlUtils;

class BottomNav extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            user: {},
            initialActive: null,
            active: null,
            flyout: false,
            showTooltip: false,
            initialPageYOffset: global.pageYOffset
        };

        if (Location.isHomepage()) {
            this.state.initialActive = this.state.active = ITEMS.HOME;
        }

        if (Location.isOffersPage()) {
            this.state.initialActive = this.state.active = ITEMS.OFFERS;
        }
    }

    accountPopRef = React.createRef();

    onClickHome = event => {
        anaUtils.setNextPageData({ navigationInfo: anaUtils.buildNavPath(['bottom nav', 'home']) });

        Location.navigateTo(event, getLink('/'));
        this.setState({
            initialActive: ITEMS.HOME,
            active: ITEMS.HOME
        });

        return false;
    };

    handleNavClick = e => {
        e.preventDefault();
        e.stopPropagation();

        this.setState({
            initialActive: ITEMS.BOTTOM_NAV,
            active: ITEMS.BOTTOM_NAV
        });
    };

    getAppBottomNavEnabled = () => {
        const navConfig = Sephora.configurationSettings?.appBottomNav;

        return Boolean(navConfig?.isEnabled);
    };

    render() {
        const { localization, isUserReady, isShopYourStoreEnabled, bottomNavigation } = this.props;
        const { active, showTooltip } = this.state;
        const isAppBottom = this.getAppBottomNavEnabled();
        const hasValidBottomNav = Boolean(
            bottomNavigation?.label && bottomNavigation?.action && bottomNavigation?.media?.src && bottomNavigation?.items?.[0]?.media?.src
        );
        const showBottomNav = Boolean(isAppBottom && hasValidBottomNav);

        const globalStyles = css`
            :root {
                --bottomNavHeight: ${HEIGHT[0]}px;
                font-family: var(--font-family-base);
                font-size: var(--font-size-base);
            }
            @supports (height: env(safe-area-inset-bottom)) {
                :root {
                    --bottomNavHeight: calc(${HEIGHT[0]}px + env(safe-area-inset-bottom));
                }
            }
            ${mediaQueries.sm} {
                :root {
                    --bottomNavHeight: ${HEIGHT[1]}px;
                }
                @supports (height: env(safe-area-inset-bottom)) {
                    :root {
                        --bottomNavHeight: calc(${HEIGHT[1]}px + env(safe-area-inset-bottom));
                    }
                }
            }
        `;

        return (
            <>
                <Global styles={globalStyles} />
                <nav
                    css={[styles.bar]}
                    data-at={Sephora.debug.dataAt('bottom_nav')}
                >
                    <a
                        href={getLink('/')}
                        data-at={Sephora.debug.dataAt('home_link')}
                        onClick={this.onClickHome}
                        css={styles.item}
                    >
                        {this.getNavIcon(ITEMS.HOME, active === ITEMS.HOME)}
                    </a>
                    <button
                        onClick={this.handleShowFlyoutClick(ITEMS.SHOP)}
                        data-at={Sephora.debug.dataAt('shop_btn')}
                        css={styles.item}
                    >
                        {this.getNavIcon(ITEMS.SHOP, active === ITEMS.SHOP)}
                    </button>
                    <a
                        href={getLink('/beauty/beauty-offers')}
                        data-at={Sephora.debug.dataAt('offers_link')}
                        onClick={e => {
                            anaUtils.setNextPageData({ navigationInfo: anaUtils.buildNavPath(['bottom nav', 'offers']) });
                            Location.navigateTo(e, getLink('/beauty/beauty-offers'));
                            this.setState({
                                initialActive: ITEMS.OFFERS,
                                active: ITEMS.OFFERS
                            });
                        }}
                        css={styles.item}
                    >
                        {this.getNavIcon(ITEMS.OFFERS, active === ITEMS.OFFERS)}
                    </a>
                    {showTooltip ? (
                        <div css={styles.item}>
                            <Popover
                                content={localization.tooltip}
                                placement='top'
                                align='center'
                                width={198}
                                textAlign='center'
                                ref={this.accountPopRef}
                                showImmediately={true}
                                fontSize='sm'
                                fontWeight='bold'
                                padding='.5em 1em'
                                invertColor={true}
                                onClick={this.closeTooltip}
                            >
                                <button
                                    key='meNavItem'
                                    onClick={this.handleShowFlyoutClick(ITEMS.ME)}
                                    data-at={Sephora.debug.dataAt('account_btn')}
                                    css={styles.meItem}
                                >
                                    {this.getNavIcon(ITEMS.ME, active === ITEMS.ME)}
                                </button>
                            </Popover>
                        </div>
                    ) : (
                        <button
                            key='meNavItem'
                            onClick={this.handleShowFlyoutClick(ITEMS.ME)}
                            data-at={Sephora.debug.dataAt('account_btn')}
                            css={styles.item}
                        >
                            {isUserReady && this.getNavIcon(ITEMS.ME, active === ITEMS.ME)}
                        </button>
                    )}
                    {showBottomNav ? (
                        <>
                            <ActionBottomNavButton
                                {...bottomNavigation}
                                key={active === ITEMS.BOTTOM_NAV ? 'active_bottom_nav_btn' : 'inactive_bottom_nav_btn'}
                                sid={bottomNavigation?.action?.sid}
                                action={bottomNavigation?.action}
                                label={bottomNavigation?.label ?? ''}
                                inactiveIcon={bottomNavigation?.media}
                                isActive={active === ITEMS.BOTTOM_NAV}
                                activeIcon={bottomNavigation?.items?.[0]?.media}
                                onClick={this.handleNavClick}
                                dataAt={bottomNavigation?.sid && Sephora.debug.dataAt(bottomNavigation.sid)}
                                css={styles.item}
                            />
                        </>
                    ) : (
                        <button
                            onClick={this.handleShowFlyoutClick(ITEMS.COMMUNITY)}
                            data-at={Sephora.debug.dataAt('community_btn')}
                            css={styles.item}
                        >
                            {this.getNavIcon(ITEMS.COMMUNITY, active === ITEMS.COMMUNITY)}
                        </button>
                    )}
                    {isShopYourStoreEnabled ? (
                        <button
                            key='my_store_btn'
                            onClick={this.handleShowFlyoutClick(ITEMS.MY_STORE)}
                            data-at={Sephora.debug.dataAt('my_store_btn')}
                            css={styles.item}
                        >
                            {this.getNavIcon(ITEMS.MY_STORE, active === ITEMS.MY_STORE, true, ITEMS.STORES)}
                        </button>
                    ) : (
                        <button
                            key='stores_btn'
                            onClick={this.handleShowFlyoutClick(ITEMS.STORES)}
                            data-at={Sephora.debug.dataAt('stores_btn')}
                            css={styles.item}
                        >
                            {this.getNavIcon(ITEMS.STORES, active === ITEMS.STORES)}
                        </button>
                    )}
                </nav>
                {this.renderFlyoutComponent(active)}
            </>
        );
    }

    showFlyout = active => () => {
        if (active === ITEMS.SHOP) {
            const pageType = anaConsts.PAGE_TYPES.SHOP_NAV;
            const pageDetail = anaConsts.PAGE_DETAIL.SHOP_NAV;
            const pageName = `${pageType}:${pageDetail}:n/a:*`;

            processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                data: {
                    pageType,
                    pageName,
                    navigationInfo: anaUtils.buildNavPath(['bottom nav', 'shop']),
                    pageDetail
                }
            });
        }

        this.setState(
            {
                active,
                flyout: true
            },
            this.closeTooltip
        );
    };

    handleShowFlyoutClick = item => this.showFlyout(item);

    renderFlyoutComponent = active => {
        const {
            localization,
            happeningLinks,
            rwdStoresAndServices,
            communityLinks,
            rwdCommunity,
            rwdNavigationMenu,
            megaNav,
            featuredLinks: fullFeaturedLinks,
            isShopYourStoreEnabled
        } = this.props;
        let comp;

        const featuredLinks = isShopYourStoreEnabled ? fullFeaturedLinks : sysUtils.excludeShopYourStoreMenuItems(fullFeaturedLinks);
        const storesModalItems = happeningLinks || rwdStoresAndServices;
        const communityModalItems = communityLinks || rwdCommunity;
        const shopModalItems = rwdNavigationMenu || megaNav?.items;

        switch (active) {
            case ITEMS.SHOP:
                comp = (
                    <ShopModal
                        onDismiss={this.reset}
                        title={localization.shop}
                        items={shopModalItems}
                        featuredLinks={featuredLinks}
                    />
                );

                break;
            case ITEMS.ME:
                comp = (
                    <AccountModal
                        onDismiss={this.reset}
                        isBottomNav={true}
                    />
                );

                break;
            case ITEMS.COMMUNITY:
                comp = (
                    <CommunityModal
                        onDismiss={this.reset}
                        title={localization.community}
                        items={communityModalItems}
                    />
                );

                break;
            case ITEMS.STORES:
                comp = (
                    <StoresModal
                        onDismiss={this.reset}
                        title={localization.store}
                        firstLevel='bottom nav'
                        items={storesModalItems}
                    />
                );

                break;
            case ITEMS.MY_STORE:
                comp = (
                    <MyStoreModal
                        onDismiss={this.reset}
                        title={localization.myStore}
                        happeningLinks={happeningLinks}
                    />
                );

                break;
            default:
                break;
        }

        return comp;
    };

    getNavIcon = (name, active, showNewBadge = false, alternateIconName) => {
        const { user, localization, isAnonymous } = this.props;
        const labelStyle = [styles.label, active && { color: colors.black }];
        const { isMyOffersModuleEnabled } = Sephora.configurationSettings;
        const iconName = alternateIconName || name;
        const isFRCanada = localeUtils.isFRCanada();

        if (name === ITEMS.ME && !isAnonymous) {
            return (
                <>
                    <Avatar
                        size={ICON_SIZE}
                        isOutlined={active}
                    />
                    <span css={labelStyle}>
                        {user.firstName
                            ? user.firstName.length > 8
                                ? `${user.firstName.charAt(0)}.${user.lastName.charAt(0)}.`
                                : user.firstName
                            : localization.me}
                        {isMyOffersModuleEnabled && (
                            <NotificationDot
                                size={6}
                                marginTop='-2px'
                                marginLeft='1px'
                            />
                        )}
                    </span>
                </>
            );
        } else {
            return (
                <>
                    <div css={styles.badgeAndIconWrapper}>
                        <Icon
                            name={active ? `${iconName}Active` : iconName}
                            color='black'
                            size={ICON_SIZE}
                            style={{ opacity: !active ? 0.6 : null }}
                        />
                        {showNewBadge && (
                            <Box
                                is='span'
                                css={styles.badge}
                            >
                                {/*
                                SDL translates "NEW" as "NOUVEAUTÉ", which doesn't fit within
                                the limited space on small screens. For this case, we should manually
                                translate "NEW" as "NOUV" (an abbreviation of "NOUVEAUTÉ"),
                                since SDL won't have the necessary context.
                                */}
                                {isFRCanada ? NEW_BADGE.FR : NEW_BADGE.EN}
                            </Box>
                        )}
                    </div>
                    <span css={labelStyle}>
                        {localization[name]}
                        {name === ITEMS.ME && isMyOffersModuleEnabled && (
                            <NotificationDot
                                size={6}
                                marginTop='-2px'
                                marginLeft='1px'
                            />
                        )}
                    </span>
                </>
            );
        }
    };

    reset = callback => {
        this.setState(
            {
                flyout: false,
                active: this.state.initialActive
            },
            () => {
                /*
                 * Type-checking because the usage of `callback` is spreaded around
                 * multiple components, and changing all their uses could introduce
                 * all sorts of instabilities. This bypass avoids unintended calls on
                 * non-callable objects.
                 */
                if (callback && typeof callback === 'function') {
                    callback();
                }
            }
        );
    };

    handleResize = () => {
        const isVisible = window.matchMedia(breakpoints.smMax).matches;

        if (this.state.flyout && !isVisible) {
            this.reset();
        }
    };

    closeTooltip = () => {
        if (this.accountPopRef?.current) {
            this.accountPopRef.current.closePopover();
            window.removeEventListener(DebouncedScroll, this.handleScroll);
            Storage.local.setItem('bottomNavShowToolTip', false);
            this.setState({ showTooltip: false });
        }
    };

    handleScroll = () => {
        const verticalScrolledDistance = this.state.initialPageYOffset - window.pageYOffset;

        if (verticalScrolledDistance >= 10 || verticalScrolledDistance <= -10) {
            this.closeTooltip();
        }
    };

    componentDidMount() {
        window.addEventListener(DebouncedResize, this.handleResize);

        const slug = this.props.bottomNavigation?.action?.page?.slug;
        const path = Location.getLocation(true).pathname;

        if (this.getAppBottomNavEnabled() && slug && path.includes(`/${slug}`)) {
            this.setState(({ initialActive, active }) =>
                active === ITEMS.BOTTOM_NAV
                    ? null
                    : {
                        active: ITEMS.BOTTOM_NAV,
                        initialActive: initialActive ?? ITEMS.BOTTOM_NAV
                    }
            );
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.isUserReady !== prevProps.isUserReady) {
            this.setState(
                {
                    showTooltip: !!(this.props.isAnonymous && !localeUtils.isFrench() && Storage.local.getItem('bottomNavShowToolTip') === null)
                },
                () => {
                    if (this.state.showTooltip) {
                        window.addEventListener(DebouncedScroll, this.handleScroll);
                        window.addEventListener('click', this.closeTooltip);
                    }
                }
            );
            window.addEventListener('pagehide', this.componentWillRefresh);
        }
    }

    componentWillRefresh() {
        Storage.local.setItem('bottomNavShowToolTip', false);
    }

    componentWillUnmount() {
        window.removeEventListener('pagehide', this.componentWillRefresh);
        window.removeEventListener(DebouncedResize, this.handleResize);

        if (this.state.showTooltip) {
            window.removeEventListener(DebouncedScroll, this.handleScroll);
            window.removeEventListener('click', this.closeTooltip);
        }
    }
}

const styles = {
    bar: {
        position: 'fixed',
        zIndex: 'calc(var(--layer-flyout) + 1)',
        left: 0,
        right: 0,
        bottom: 0,
        height: 'var(--bottomNavHeight)',
        boxShadow: '0 -1px 0 0 rgba(0, 0, 0, .1)',
        backgroundColor: colors.white,
        display: 'flex',
        justifyContent: 'space-between',
        fontSize: fontSizes.xs,
        [mediaQueries.sm]: {
            fontSize: fontSizes.base
        }
    },
    item: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        paddingTop: '1em',
        color: colors.gray,
        lineHeight: 1
    },
    meItem: {
        display: 'flex',
        flex: 1,
        flexDirection: 'column'
    },
    label: {
        marginTop: '.5em'
    },
    badgeAndIconWrapper: {
        position: 'relative'
    },
    badge: {
        position: 'absolute',
        right: '-50%',
        top: '-20%',
        padding: '2px',
        color: colors.white,
        backgroundColor: colors.black,
        border: '1px solid',
        borderColor: colors.white,
        borderRadius: '4px',
        fontSize: '8px',
        fontWeight: fontWeights.bold,
        textTransform: 'uppercase',
        [mediaQueries.sm]: {
            fontSize: fontSizes.xs
        }
    }
};

export default wrapComponent(BottomNav, 'BottomNav', true);
