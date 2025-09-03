/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
/* eslint-disable complexity */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';

import {
    colors, mediaQueries, site, space
} from 'style/config';
import { Container, Box } from 'components/ui';
import ChicletNav from 'components/Homepage/ChicletNav/ChicletNav';
import SiteSearch from 'components/SiteSearch/SiteSearch';
import InlineBasket from 'components/InlineBasket/InlineBasket';
import TopNav from 'components/Header/TopNav/TopNav';
import BottomNav from 'components/Header/BottomNav';
import StoresDrop from 'components/Header/StoresDrop/StoresDrop';
import CommunityDrop from 'components/Header/CommunityDrop/CommunityDrop';
import ServicesAndEventsDrop from 'components/Header/ServicesAndEventsDrop/ServicesAndEventsDrop';
import AccountMenu from 'components/Header/AccountMenu';
import PersistentBanner from 'components/Header/PersistentBanner';
import AndroidAppBanner from 'components/Banner/AndroidAppBanner/AndroidAppBanner';
import MNW from 'components/MNW';
import Loves from 'components/Loves';
import TestTarget from 'components/TestTarget/TestTarget';
import Location from 'utils/Location';
import localeUtils from 'utils/LanguageLocale';
import Banner from 'components/Content/Banner';
import SkeletonBanner from 'components/Banner/SkeletonBanner/SkeletonBanner';
import contentConsts from 'constants/content';
import CompactHeader from 'components/Header/CompactHeader';

/* utils */
import anaUtils from 'analytics/utils';
import mediaUtils from 'utils/Media';
import urlUtils from 'utils/Url';

const { BANNER_TYPES } = contentConsts;
const { Media } = mediaUtils;
const { getLink } = urlUtils;
const getText = localeUtils.getLocaleResourceFile('components/Header/locales', 'Header');

const DROP_WIDTH = 375;

class Header extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            cachedData: null,
            initialPageYOffset: global.pageYOffset
        };
    }

    basketOverlayPositionRef = React.createRef();
    basketOverlayPortalRef = React.createRef();
    persistentBannerWrapperRef = React.createRef();

    onClickLogo = event => {
        anaUtils.setNextPageData({ navigationInfo: anaUtils.buildNavPath(['top nav', 'sephora icon']) });
        digitalData.page.attributes.productStrings = '';
        const targetUrl = getLink('/');
        Location.navigateTo(event, targetUrl);

        return false;
    };

    render() {
        const {
            headerFooterContent = {}, hideBanners, menuItems, user, p13n, isCompact, showBlackSearchHeader, isShopYourStoreEnabled
        } = this.props;

        const getBanner1 = () => {
            if (headerFooterContent.persistentBanner) {
                return headerFooterContent.persistentBanner;
            }

            return null;
        };

        const getBanner2 = () => {
            if (headerFooterContent.notificationBanner && Array.isArray(headerFooterContent.notificationBanner)) {
                return headerFooterContent.notificationBanner[0];
            }

            return null;
        };

        const banner1Data = getBanner1();
        const banner2Data = getBanner2();

        // Check if BCC component is enabled for A/B testing (set in BCC)
        const isEnabledTestingInBCC = banner1Data !== null && banner1Data.enableTesting !== undefined ? banner1Data.enableTesting : false;

        const storesDropItems = headerFooterContent.happeningLinks || headerFooterContent.rwdStoresAndServices;
        const communityDropItems = headerFooterContent.communityLinks || headerFooterContent.rwdCommunity;
        const testComponent = PersistentBanner;
        const smallSkeletonHeight = banner1Data?.[0]?.media?.height ?? 48;
        const largeSkeletonHeight = banner1Data?.[0]?.largeMedia?.height ?? 60;

        return isCompact ? (
            <CompactHeader />
        ) : (
            <header style={{ display: 'contents' }}>
                <MNW />
                <AndroidAppBanner />
                {!hideBanners && banner1Data && (
                    <div ref={this.persistentBannerWrapperRef}>
                        <TestTarget
                            data={banner1Data}
                            bannerType={BANNER_TYPES.PERSISTENT}
                            testComponent={testComponent}
                            testName={'persistentBannerTest'}
                            testEnabled={isEnabledTestingInBCC}
                            useMediaHeight={true}
                            isPersistentBanner1
                            skeleton={<SkeletonBanner height={[smallSkeletonHeight, largeSkeletonHeight, largeSkeletonHeight]} />}
                        />
                    </div>
                )}
                <div css={showBlackSearchHeader ? styles.altHeader : styles.header}>
                    <Container>
                        <div css={styles.inner}>
                            <a
                                href={getLink('/')}
                                aria-label={getText('homepage')}
                                onClick={this.onClickLogo}
                                css={styles.logoLink}
                            >
                                <Box
                                    is='svg'
                                    viewBox='0 0 125 17'
                                    width={[102, 147]}
                                    height={[14, 20]}
                                    data-at={Sephora.debug.dataAt('sephora_logo_ref')}
                                >
                                    <path
                                        {...(showBlackSearchHeader && { fill: 'white' })}
                                        fillRule='evenodd'
                                        d='M8.94 1.645s-.05.142-.747 2.032c-1.992-1.586-5.33-1.47-5.33.97 0 2.861 6.972 2.502 6.755 7.61C9.445 16.36 4.395 17.302.5 15.326c.34-.723.694-1.42.936-1.99 2.945 1.741 5.481.943 5.898-.458C8.473 9.044.53 10.228.53 4.793c0-2.286 2.647-5.84 8.41-3.148ZM16.465 1.33h9.124s-.027.822-.01 1.991H18.75v4.082h4.844c-.017.814-.008 1.453-.008 1.873H18.75v5.088h6.83a104.28 104.28 0 0 0 0 1.954h-9.106L16.465 1.33ZM38.195 8.675c-.55 0-.958-.006-1.516-.009 0-2.796.005-5.41.005-5.41s.666-.003 1.295-.003c.602 0 4.106-.273 4.22 2.523.11 2.757-2.648 2.9-4.004 2.9Zm.136-7.316c-.81-.02-2.501-.029-3.945-.029l.005 14.988h2.296s-.007-2.861-.008-5.682c.569-.01 1.75-.041 2.705-.068 1.323-.04 4.8-.701 4.776-4.811-.027-4.62-5.025-4.38-5.83-4.398ZM97.183 8.268c-.536 0-.923-.01-1.466-.014.002-2.632.008-5.058.008-5.058s.628-.009 1.236-.009c.58 0 3.685-.175 3.948 2.267.312 2.885-3.092 2.814-3.726 2.814Zm5.053 8.05h2.854l-4.737-6.725c1.275-.469 2.753-1.557 2.566-4.043-.334-4.454-4.686-4.124-5.618-4.167-.785-.037-2.475-.059-3.94-.052v14.987h2.364s-.007-3.354-.009-6.318c.784.003 1.064-.011 2.246-.042l4.274 6.36ZM61.063 6.976V1.33h2.321v14.336h-2.322V8.851l-7.738.01v6.805h-2.321V1.33h2.32v5.646h7.74ZM79.167.68c-4.823 0-7.963 3.501-7.963 7.82 0 4.319 3.14 7.82 7.963 7.82s7.962-3.501 7.962-7.82c0-4.319-3.14-7.82-7.962-7.82Zm0 2.128c-3.536 0-5.544 2.548-5.544 5.691 0 3.144 1.988 5.692 5.544 5.692 3.555 0 5.543-2.548 5.543-5.692 0-3.143-2.008-5.691-5.543-5.691Zm36.209 7.99 4.935-.03-2.507-7.306h-.033l-2.395 7.336Zm1.084-9.688h2.745l5.435 14.855-2.43-.006s-.537-1.499-1.253-3.484l-6.13.038s-.246.764-.977 3.447h-2.343l4.953-14.85Z'
                                    />
                                </Box>
                            </a>
                            <div css={styles.searchWrap}>
                                <SiteSearch />
                            </div>
                            <div css={styles.dropsWrap}>
                                <Media
                                    greaterThan='sm'
                                    css={{
                                        display: 'flex',
                                        height: 62
                                    }}
                                >
                                    <StoresDrop
                                        items={storesDropItems}
                                        dropWidth={DROP_WIDTH}
                                        isShopYourStoreEnabled={isShopYourStoreEnabled}
                                        {...(showBlackSearchHeader && { showBlackSearchHeader: showBlackSearchHeader })}
                                    />
                                    {isShopYourStoreEnabled ? (
                                        <ServicesAndEventsDrop
                                            items={storesDropItems}
                                            dropWidth={DROP_WIDTH}
                                            {...(showBlackSearchHeader && { showBlackSearchHeader: showBlackSearchHeader })}
                                        />
                                    ) : (
                                        <CommunityDrop
                                            items={communityDropItems}
                                            dropWidth={DROP_WIDTH}
                                            {...(showBlackSearchHeader && { showBlackSearchHeader: showBlackSearchHeader })}
                                        />
                                    )}
                                    <div css={styles.dropsDivider} />
                                    <AccountMenu
                                        dropWidth={DROP_WIDTH}
                                        {...(showBlackSearchHeader && { showBlackSearchHeader: showBlackSearchHeader })}
                                    />
                                </Media>
                                <Loves
                                    maxLoves={5}
                                    compType='InlineLoves'
                                    showCount={true}
                                    compProps={{ dropWidth: DROP_WIDTH }}
                                />
                                <InlineBasket
                                    basketOverlayRefs={{
                                        position: this.basketOverlayPositionRef,
                                        portal: this.basketOverlayPortalRef
                                    }}
                                    dropWidth={DROP_WIDTH}
                                    {...(showBlackSearchHeader && { showBlackSearchHeader: showBlackSearchHeader })}
                                />
                            </div>
                        </div>
                    </Container>
                    <Media greaterThan='sm'>
                        <TopNav
                            items={menuItems}
                            p13n={p13n}
                            user={user}
                        />
                    </Media>
                    <div ref={this.basketOverlayPositionRef} />
                </div>
                <div
                    ref={this.basketOverlayPortalRef}
                    id='MastheadBottom'
                />
                {banner2Data && !hideBanners && (
                    <Banner
                        {...banner2Data}
                        bannerType={BANNER_TYPES.NOTIFICATION}
                        marginTop={[0, 0]}
                        marginBottom={[0, 0]}
                    />
                )}

                <Media lessThan='md'>
                    {Location.isHomepage() && Sephora.channel === 'MW' && <ChicletNav menuItems={menuItems} />}
                    <BottomNav
                        {...headerFooterContent}
                        menuItems={menuItems}
                    />
                </Media>
            </header>
        );
    }
}

const styles = {
    header: {
        backgroundColor: colors.white,
        zIndex: 'var(--layer-header)',
        [mediaQueries.smMax]: {
            borderBottom: `1px solid ${colors.lightGray}`
        },
        [mediaQueries.xsMax]: {
            position: 'sticky',
            top: 0,
            height: site.headerHeight
        }
    },
    altHeader: {
        color: colors.white,
        backgroundColor: colors.black,
        zIndex: 'var(--layer-header)',
        transition: 'background-color 0.7s ease, color 0.7s ease',
        [mediaQueries.xsMax]: {
            position: 'sticky',
            top: 0,
            height: site.headerHeight
        }
    },
    inner: {
        display: 'flex',
        alignItems: 'center',
        marginRight: -space[2],
        position: 'relative',
        [mediaQueries.sm]: {
            marginRight: -space[3],
            marginTop: space[3],
            marginBottom: space[3]
        },
        [`@media (min-width: ${site.containerMax + space.container * 2}px)`]: {
            marginTop: space[4],
            marginBottom: space[4]
        }
    },
    logoLink: {
        display: 'flex',
        alignItems: 'center',
        paddingLeft: space.container,
        marginLeft: -space.container,
        paddingRight: space[4],
        marginRight: -space[4],
        height: site.headerHeight,
        [mediaQueries.sm]: {
            height: 'auto',
            paddingTop: space[4],
            paddingBottom: space[4]
        }
    },
    searchWrap: {
        flex: 1,
        paddingLeft: space[4],
        paddingRight: space[2],
        [mediaQueries.sm]: {
            paddingLeft: space[5],
            paddingRight: space[3]
        },
        [mediaQueries.md]: {
            paddingLeft: space[6],
            paddingRight: space[6]
        }
    },
    dropsWrap: {
        display: 'flex',
        [mediaQueries.md]: { marginLeft: -space[4] }
    },
    dropsDivider: {
        borderLeft: `1px solid ${colors.lightGray}`,
        marginLeft: space[2],
        height: 32,
        alignSelf: 'center'
    },
    loveAnchor: {
        lineHeight: 0,
        paddingLeft: space[2],
        paddingRight: space[2],
        marginLeft: -space[2],
        [mediaQueries.sm]: {
            paddingLeft: space[3],
            paddingRight: space[3],
            marginLeft: -space[3]
        }
    },
    container: {
        position: 'relative',
        width: '1280px',
        padding: 0
    }
};

export default wrapComponent(Header, 'Header', true);
