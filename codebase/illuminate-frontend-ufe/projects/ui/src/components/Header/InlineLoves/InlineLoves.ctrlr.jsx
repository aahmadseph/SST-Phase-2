/* eslint-disable complexity */
/* eslint-disable object-curly-newline */

/* eslint-disable class-methods-use-this */
/* eslint-disable no-unused-expressions */
import React from 'react';
import { wrapComponent } from 'utils/framework';
import helpersUtils from 'utils/Helpers';
import BaseClass from 'components/BaseClass';
import { breakpoints, mediaQueries, site, space, colors, fontSizes } from 'style/config';
import store from 'store/Store';
import actions from 'Actions';
import { Box, Flex, Grid, Link, Text, Icon, Button, Divider } from 'components/ui';
import Modal from 'components/Modal/Modal';
import Dropdown from 'components/Dropdown/Dropdown';
import ProductImage from 'components/Product/ProductImage/ProductImage';
import ProductVariation from 'components/Product/ProductVariation/ProductVariation';
import Price from 'components/Product/Price/Price';
import AddToBasketButton from 'components/AddToBasketButton';
import CountCircle from 'components/CountCircle';
import OnlyFewLeftFlag from 'components/OnlyFewLeftFlag/OnlyFewLeftFlag';
import SaleFlag from 'components/SaleFlag/SaleFlag';
import SeeProductDetails from 'components/SeeProductDetails';
import basketUtils from 'utils/Basket';
import userUtils from 'utils/User';
import auth from 'utils/Authentication';
import analyticsUtils from 'analytics/utils';
import processEvent from 'analytics/processEvent';
import mediaUtils from 'utils/Media';
import localeUtils from 'utils/LanguageLocale';
import skuUtils from 'utils/Sku';
import anaConsts from 'analytics/constants';
import Location from 'utils/Location';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import Storage from 'utils/localStorage/Storage';
import { DebouncedResize, TestTargetReady, UserInfoReady } from 'constants/events';
import { HEADER_VALUE } from 'constants/authentication';
import myListsUtils from 'utils/MyLists';
import InlineLoveListsHeader from 'components/Header/InlineLoves/InlineLoveListsHeader';
import InlineLovesList from 'components/Header/InlineLoves/InlineLovesList';
import LovesChunklets from 'components/Header/InlineLoves/LovesChunklets/LovesChunklets';
import GetTheseBeforeTheyreGone from 'components/Header/InlineLoves/GetTheseBeforeTheyreGone';
const isSharableListEnabled = myListsUtils.isSharableListEnabled();
import Empty from 'constants/empty';
import MyListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';
import { MIN_ITEMS_PER_PAGE, MAX_ITEMS_PER_PAGE, MAX_ONLY_A_FEW_LEFT_IN_LOVES_LIST_FLYOUT, MAX_FLYOUT_RECENT_ITEMS } from 'constants/sharableList';

const getLovesUrl = () => (myListsUtils.isSharableListEnabled() ? '/profile/Lists' : '/shopping-list');
const { ADD_TO_BASKET_TYPES: ADD_BUTTON_TYPE } = basketUtils;
const { deferTaskExecution } = helpersUtils;
const { Media } = mediaUtils;
const {
    ASYNC_PAGE_LOAD,
    PAGE_TYPES: { LOVES_MODAL, USER_PROFILE, MY_LISTS_FLYOUT },
    PAGE_NAMES: { MY_LISTS },
    LinkData: { LOVES_MODAL_VIEW_ALL }
} = anaConsts;

const getText = text => localeUtils.getLocaleResourceFile('components/Header/InlineLoves/locales', 'InlineLoves')(text);

const signIn = () => {
    auth.requireAuthentication(null, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
};

const trackViewAllClick = () => {
    const prop55 = LOVES_MODAL_VIEW_ALL;
    digitalData.page.attributes.previousPageData.linkData = prop55;
    let recentEvent;

    // Checking if the loves modal is for small viewport only where loves modal shows from bottom.
    if (!window.matchMedia(breakpoints.smMin).matches) {
        recentEvent = analyticsUtils.getLastAsyncPageLoadData({ pageType: LOVES_MODAL });
    }

    analyticsUtils.setNextPageData({
        ...recentEvent,
        linkData: prop55
    });
};

const handleViewAllClick = e => {
    trackViewAllClick();

    const href = e?.currentTarget?.getAttribute('href');

    if (href) {
        Location.navigateTo(e, href);
    }
};

const handleLinkClick = (e, targetUrl, toggleModal) => {
    toggleModal && toggleModal();
    Location.navigateTo(e, targetUrl);
};

function renderHeader({
    showLink,
    getTextString,
    totalNotifications,
    shouldDisplayOAFLProducts = false,
    shouldDisplaySaleProducts = false,
    shouldDisplayFavBrandsSpoke = false,
    isAnonymousSharable = false
}) {
    return (
        <React.Fragment>
            <Flex
                justifyContent='space-between'
                alignItems='center'
            >
                <Flex>
                    <Text
                        is='h2'
                        fontWeight='bold'
                        display={totalNotifications > 0 && 'flex'}
                        alignItems={totalNotifications > 0 && 'center'}
                        data-at={Sephora.debug.dataAt('loves_title')}
                    >
                        {getText(getTextString)}
                    </Text>
                    {totalNotifications > 0 && (
                        <Box
                            paddingRight={30}
                            paddingLeft={10}
                        >
                            <CountCircle
                                top={0}
                                right={0}
                                position='static'
                                key={`inlineLovesCount${totalNotifications}`}
                                children={totalNotifications}
                            />
                        </Box>
                    )}
                </Flex>
                {showLink && (
                    <Link
                        href={getLovesUrl()}
                        color='blue'
                        padding={2}
                        margin={-2}
                        onClick={handleViewAllClick}
                        children={getText('viewAll')}
                        data-at={Sephora.debug.dataAt('view_all_btn')}
                    />
                )}
            </Flex>
            {shouldDisplayFavBrandsSpoke && renderLGUIFavBrands()}
            {!isAnonymousSharable && (
                <Divider
                    marginTop={4}
                    marginBottom={shouldDisplayOAFLProducts || shouldDisplaySaleProducts ? 4 : 3}
                    marginX={-4}
                />
            )}
        </React.Fragment>
    );
}

function renderNoLoves(isAnonymous) {
    const isAnonymousSharable = isSharableListEnabled && isAnonymous;
    const lovesTitle = !isAnonymousSharable ? 'recentlyLoved' : 'myLists';
    const loveDesc = isAnonymousSharable ? getText('noLovesMyListDesc') : getText('noLovesDesc');
    const descFontWeight = isAnonymousSharable ? 400 : 'bold';

    return (
        <React.Fragment>
            <Media greaterThan='xs'>
                {renderHeader({
                    showLink: false,
                    getTextString: lovesTitle,
                    isAnonymousSharable
                })}
            </Media>
            {!isAnonymous && renderLGUIFavBrands()}
            <Box
                textAlign={!isAnonymousSharable ? 'center' : 'left'}
                paddingTop={!isAnonymous ? [1, 4] : isAnonymousSharable ? [0, 3] : 3}
                paddingBottom={2}
            >
                <Text
                    is='p'
                    marginBottom={4}
                    fontWeight={descFontWeight}
                    data-at={Sephora.debug.dataAt('empty_message')}
                >
                    {loveDesc}
                </Text>
                {isAnonymous ? (
                    <Grid
                        gap={3}
                        columns={2}
                    >
                        <Button
                            onClick={signIn}
                            block={true}
                            variant='primary'
                            size='sm'
                            children={getText('signInButton')}
                            data-at={Sephora.debug.dataAt('sign_in_loves')}
                        />
                        <Button
                            onClick={() => store.dispatch(actions.showRegisterModal({ isOpen: true, openPostBiSignUpModal: true }))}
                            block={true}
                            variant='secondary'
                            size='sm'
                            children={getText('createAccountButton')}
                            data-at={Sephora.debug.dataAt('create_account_loves')}
                        />
                    </Grid>
                ) : (
                    <Button
                        href='/'
                        hasMinWidth={true}
                        variant='primary'
                        size='sm'
                        children={getText('shopNow')}
                    />
                )}
            </Box>
        </React.Fragment>
    );
}

const renderFavBrands = (marginX = 0) => {
    return (
        <React.Fragment>
            <Box
                backgroundColor={colors.lightBlue}
                borderRadius={2}
                paddingX={3}
                paddingY={2}
                marginTop={3}
                marginX={marginX}
            >
                <Flex
                    flexDirection='column'
                    fontSize='sm'
                >
                    {getText('lookingForFavBrands')}
                    <Link
                        color='blue'
                        underline={true}
                        children={getText('goToBeautyPrefs')}
                        href='/profile/BeautyPreferences'
                    />
                </Flex>
            </Box>
        </React.Fragment>
    );
};

const renderLGUIFavBrands = () => <Media greaterThan='xs'>{renderFavBrands()}</Media>;

const renderCTA = (item, toggleModal) => {
    return item.isExternallySellable ? (
        <SeeProductDetails
            variant={'secondary'}
            size={'sm'}
        />
    ) : (
        <AddToBasketButton
            sku={item}
            variant={ADD_BUTTON_TYPE.SECONDARY}
            analyticsContext={LOVES_MODAL}
            isAddButton={true}
            callback={toggleModal ? () => toggleModal() : null}
            size='sm'
            isInlineLoves={true}
        />
    );
};

const renderLovesList = (loves, toggleModal, showLovesListSaleNotification = false) => {
    return loves.map((item, index) => (
        <React.Fragment key={`inlineLovesItem_${item.skuId}`}>
            {index > 0 && (
                <Divider
                    marginY={3}
                    marginX={-4}
                />
            )}
            <Link
                href={item.targetUrl}
                display='block'
                hoverSelector='.Link-target'
                onClick={e => handleLinkClick(e, item.targetUrl, toggleModal)}
                data-at={Sephora.debug.dataAt('loves_item')}
            >
                <Grid
                    columns='auto 1fr 88px'
                    alignItems='flex-start'
                >
                    <ProductImage
                        id={item.skuId}
                        skuImages={item.skuImages}
                        size={48}
                        disableLazyLoad={true}
                    />
                    <Box fontSize='sm'>
                        <Text
                            className='Link-target'
                            display='block'
                            fontWeight='bold'
                            numberOfLines={1}
                            children={item.brandName}
                            data-at={Sephora.debug.dataAt('item_brand')}
                        />
                        <Text
                            className='Link-target'
                            display='block'
                            children={item.productName}
                            data-at={Sephora.debug.dataAt('item_name')}
                        />
                        <ProductVariation
                            sku={item}
                            fontSize='sm'
                            marginTop='.25em'
                        />
                        {showLovesListSaleNotification && item?.salePrice && <SaleFlag marginRight='4px' />}
                        {item?.isOnlyFewLeft && <OnlyFewLeftFlag />}
                        <Price
                            includeValue={false}
                            sku={item}
                            marginTop='.25em'
                        />
                    </Box>
                    {skuUtils.isCountryRestricted(item) ? (
                        <Text
                            color='gray'
                            fontSize='sm'
                            textAlign='center'
                            data-at={Sephora.debug.dataAt('restriction_message')}
                        >
                            {getText('itemShip')} {localeUtils.isCanada() ? 'Canada' : 'the United States'}
                        </Text>
                    ) : (
                        renderCTA(item, toggleModal)
                    )}
                </Grid>
            </Link>
        </React.Fragment>
    ));
};

function renderLoves({
    loves,
    toggleModal,
    onlyAFewLeftInLovesList = [],
    onSaleInLovesList = [],
    shouldDisplayOAFLProducts,
    shouldDisplaySaleProducts,
    showLovesListSaleNotification,
    totalNotifications = 0
}) {
    let displayedLoves = shouldDisplayOAFLProducts ? loves.filter(love => !onlyAFewLeftInLovesList.includes(love)) : loves;
    displayedLoves = shouldDisplaySaleProducts ? displayedLoves.filter(love => !onSaleInLovesList.includes(love)) : displayedLoves;
    displayedLoves = totalNotifications >= 3 ? displayedLoves.slice(0, 2) : displayedLoves.slice(0, 5 - totalNotifications);
    const combinedSaleAndOnlyAFewLeftList = [...onlyAFewLeftInLovesList, ...(shouldDisplaySaleProducts ? onSaleInLovesList : [])];
    const displayedSaleAndOnlyFewLovesList = totalNotifications > 3 ? combinedSaleAndOnlyAFewLeftList.slice(0, 3) : combinedSaleAndOnlyAFewLeftList;
    const headerCopy = !shouldDisplayOAFLProducts && shouldDisplaySaleProducts ? 'onSaleNow' : 'getTheseBeforeTheyAreGone';

    return (
        <>
            {(shouldDisplayOAFLProducts || shouldDisplaySaleProducts) && (
                <>
                    <Media greaterThan='xs'>
                        {renderHeader({
                            showLink: true,
                            getTextString: 'loves',
                            shouldDisplayOAFLProducts,
                            shouldDisplaySaleProducts,
                            shouldDisplayFavBrandsSpoke: shouldDisplayOAFLProducts || shouldDisplaySaleProducts
                        })}
                        {renderHeader({
                            showLink: false,
                            getTextString: headerCopy,
                            totalNotifications,
                            shouldDisplayOAFLProducts,
                            shouldDisplaySaleProducts
                        })}
                    </Media>
                    <Media at='xs'>
                        {renderHeader({
                            showLink: true,
                            getTextString: headerCopy,
                            totalNotifications,
                            shouldDisplayOAFLProducts,
                            shouldDisplaySaleProducts
                        })}
                    </Media>
                    {renderLovesList(displayedSaleAndOnlyFewLovesList, toggleModal, showLovesListSaleNotification)}
                    <Divider
                        marginY={4}
                        marginX={-4}
                    />
                </>
            )}

            {renderHeader({
                showLink: !shouldDisplayOAFLProducts && !shouldDisplaySaleProducts,
                getTextString: 'recentlyLoved',
                shouldDisplayFavBrandsSpoke: !shouldDisplayOAFLProducts && !shouldDisplaySaleProducts
            })}
            {renderLovesList(displayedLoves, toggleModal)}
        </>
    );
}

class InlineLoves extends BaseClass {
    state = {
        isOpen: false,
        isAnonymous: null,
        isLovesListPage: false,
        shouldDisplayOAFLProducts: false,
        shouldDisplaySaleProducts: false,
        shouldDisplayNotification: false,
        showLovesListSaleNotification: false,
        totalOnlyAFewLeftLoves: 0,
        totalOnSaleLoves: 0,
        skus: [],
        hasFetchedListsData: false
    };

    trackNavClick = () => {
        // Analytics are less priority than UI response, so defer them with low priority
        deferTaskExecution(() => {
            const navigationInfo = analyticsUtils.buildNavPath(['top nav', 'loves icon']);
            const smallViewport = !window.matchMedia(breakpoints.smMin).matches;

            if (smallViewport) {
                const pageType = LOVES_MODAL;
                const pageDetail = 'lists-loves modal';
                const pageName = myListsUtils.isSharableListEnabled()
                    ? `${USER_PROFILE}:${MY_LISTS}:${MY_LISTS_FLYOUT}:*`
                    : `${pageType}:${pageDetail}:n/a:*`;

                // eslint-disable-next-line no-undef
                const previousPageName = digitalData.page.attributes.sephoraPageInfo.pageName;
                processEvent.process(ASYNC_PAGE_LOAD, {
                    data: {
                        pageName,
                        pageType,
                        pageDetail,
                        previousPageName,
                        navigationInfo
                    }
                });
            } else {
                analyticsUtils.setNextPageData({ navigationInfo });
            }
        });
    };

    handleLoveIconClick = e => {
        if (!this.props.isSharableListEnabled) {
            this.trackNavClick();
        } else {
            MyListsBindings.heartClick();
        }

        const href = e?.currentTarget?.getAttribute('href');

        if (href) {
            Location.navigateTo(e, href);
        }
    };

    toggleModal = e => {
        e && e.preventDefault();

        if (this.props.disableModal) {
            return;
        }

        // CRITICAL: Update only the heart icon state first for immediate visual feedback
        this.setState({ isOpen: !this.state.isOpen });

        this.setState({ isModalOpen: !this.state.isModalOpen });
    };

    handleTrigger = isDropdownOpen => () => {
        this.setState({
            isOpen: isDropdownOpen
        });
    };

    handleMouseEnter = () => {
        if (!Sephora.isMobile()) {
            this.setState({ isHover: true });
        }
    };

    handleMouseLeave = () => {
        this.setState({ isHover: false });
    };

    render() {
        const { isLovesListPage, isAnonymous } = this.state;
        const isAnonymousSharable = isSharableListEnabled && isAnonymous;
        const lovesTitle = !isAnonymousSharable ? getText('loves') : getText('myLists');

        if (isLovesListPage) {
            return this.getIcon();
        }

        return (
            <>
                {this.renderLGUI({ lovesTitle })}
                {this.renderSMUI()}
            </>
        );
    }

    renderShareable = ({ isSMUI = false } = {}) => {
        const { showLovesListSaleNotification, isAnonymous, isModalOpen } = this.state;
        const { isPerfImprovementEnabled, isEmptyLists, limitedLoveListItems, recentlyItemsAdded = Empty.Object, SHOW_LOW_IN_STOCK_MAX } = this.props;
        const isAnonymousSharable = isSharableListEnabled && isAnonymous;
        const skus = isPerfImprovementEnabled ? recentlyItemsAdded : this.state.skus;
        const emptyList = isPerfImprovementEnabled ? isEmptyLists : skus.length === 0;
        const totalFewLeft = limitedLoveListItems?.length > 5 ? SHOW_LOW_IN_STOCK_MAX : limitedLoveListItems.length || 0;
        const emptyFewLeft = totalFewLeft === 0;
        const lowInStockItems = limitedLoveListItems.slice(0, SHOW_LOW_IN_STOCK_MAX) || Empty.Array;

        return (
            <>
                {!isSMUI && emptyList && (
                    <InlineLoveListsHeader
                        title={getText('myLists')}
                        center={false}
                        fontSize={fontSizes.md}
                        showDivider={false}
                    ></InlineLoveListsHeader>
                )}
                {!emptyList && (
                    <InlineLoveListsHeader
                        title={getText('recentLists')}
                        linkURL={getLovesUrl()}
                        showLink={true}
                        callback={this.toggleModal}
                        isModalOpen={isModalOpen}
                        showDivider={false}
                    ></InlineLoveListsHeader>
                )}
                {!emptyList && (
                    <LovesChunklets
                        arrowWidth={10}
                        arrowCircleWidth={32}
                        lists={this.props?.myLists?.allLoves}
                        handleLinkClick={handleLinkClick}
                        toggleModal={isModalOpen && this.toggleModal}
                    ></LovesChunklets>
                )}
                {!emptyFewLeft && (
                    <InlineLoveListsHeader
                        title={getText('getTheseBeforeTheyAreGone')}
                        totalNotifications={totalFewLeft}
                        showDivider={false}
                        paddingBottom={4}
                        linkURL={getLovesUrl()}
                        showLink={true}
                        callback={this.toggleModal}
                        isModalOpen={isModalOpen}
                        paddingTop={0}
                    ></InlineLoveListsHeader>
                )}
                {!emptyFewLeft && <GetTheseBeforeTheyreGone skus={lowInStockItems} />}
                {!emptyList && (
                    <InlineLoveListsHeader
                        title={getText('recentlyAdded')}
                        linkURL={getLovesUrl()}
                        showLink={true}
                        callback={this.toggleModal}
                        isModalOpen={isModalOpen}
                    ></InlineLoveListsHeader>
                )}
                <InlineLovesList
                    toggleModal={this.toggleModal}
                    showLovesListSaleNotification={showLovesListSaleNotification}
                    handleLinkClick={handleLinkClick}
                    skus={skus}
                    isAnonymousSharable={isAnonymousSharable}
                ></InlineLovesList>
            </>
        );
    };

    renderLGUI = () => {
        const { isOpen, shouldDisplayNotification, totalNotifications, isHover } = this.state;
        const itemLoveCount = !isSharableListEnabled
            ? totalNotifications || this.props.totalLoves
            : this.props.limitedLoveListItems?.length >= 5
                ? 5
                : this.props.limitedLoveListItems?.length || 0;
        const shouldShowCountCircle = myListsUtils.isSharableListEnabled()
            ? itemLoveCount > 0
            : shouldDisplayNotification || this.props.shouldShowTotalLoves;

        return (
            <Media
                greaterThan='xs'
                css={{ height: '100%' }}
            >
                <Dropdown
                    id='loves_drop'
                    hasMaxHeight={true}
                    mouseEnterCallback={this.mouseEnterCallback}
                    position='static'
                    onTrigger={this.handleTrigger}
                    height='100%'
                    data-at={Sephora.debug.dataAt('loves_flyout')}
                    onMouseEnter={this.handleMouseEnter}
                    onMouseLeave={this.handleMouseLeave}
                >
                    <Dropdown.Trigger
                        zIndex={isOpen && 1}
                        aria-label={getText('loves')}
                        href={getLovesUrl()}
                        onClick={this.handleLoveIconClick}
                        css={styles.anchor}
                    >
                        {/* improve hover usability */}
                        <span
                            style={!isOpen ? { display: 'none' } : null}
                            css={{
                                position: 'absolute',
                                left: '50%',
                                bottom: -32,
                                marginLeft: -32,
                                width: 64,
                                height: 64,
                                transform: 'rotate(-45deg)'
                            }}
                        />
                        <div css={styles.iconWrap}>
                            <Icon
                                data-at={Sephora.debug.dataAt('love_icon_large')}
                                name={isOpen || isHover ? 'heart' : 'heartOutline'}
                            />
                            {shouldShowCountCircle && (
                                <CountCircle
                                    aria-label={totalNotifications === 1 ? getText('item') : getText('items')}
                                    key={`inlineLovesCount${totalNotifications}`}
                                    data-at={Sephora.debug.dataAt('loves_count')}
                                    children={itemLoveCount}
                                />
                            )}
                        </div>
                    </Dropdown.Trigger>
                    <Dropdown.Menu
                        width={this.props.dropWidth}
                        align='right'
                    >
                        {isSharableListEnabled ? this.renderShareable() : this.getContent()}
                    </Dropdown.Menu>
                </Dropdown>
            </Media>
        );
    };

    renderSMUI = () => {
        const { isAnonymous } = this.state;
        const title = isSharableListEnabled ? getText('myLists') : getText('loves');

        return (
            <Media at='xs'>
                {this.getIcon('small', this.toggleModal)}
                <Modal
                    isOpen={this.state.isModalOpen}
                    isDrawer={true}
                    onDismiss={this.toggleModal}
                    style={!this.state.isModalOpen ? { display: 'none' } : undefined}
                >
                    <Modal.Header>
                        <Modal.Title children={title} />
                    </Modal.Header>
                    <Modal.Body
                        paddingX={null}
                        paddingTop={null}
                        paddingBottom={null}
                    >
                        {!isAnonymous && !isSharableListEnabled && renderFavBrands(4)}
                        {isSharableListEnabled ? this.renderShareable({ isSMUI: true }) : this.getContent()}
                    </Modal.Body>
                </Modal>
            </Media>
        );
    };

    // Extracted to avoid recreating function on each render
    iconClickHandler = onClick => e => {
        e && e.preventDefault();

        deferTaskExecution(() => {
            // Only call onClick (toggleModal) after heart is updated
            onClick && onClick(e);
            this.handleLoveIconClick();
        });

        return false; // Prevent default
    };

    getIcon = (view, onClick) => {
        const { isOpen, isLovesListPage, shouldDisplayNotification, totalNotifications, isAnonymous } = this.state;
        const isAnonymousSharable = isSharableListEnabled && isAnonymous;

        const WrapEl = isLovesListPage ? 'div' : 'a';

        // Use the memoized handler
        const handler = this.iconClickHandler(onClick);

        const itemLoveCount = !isSharableListEnabled
            ? totalNotifications || this.props.totalLoves
            : this.state.fewLeftSkus?.length >= 5
                ? 5
                : this.state.fewLeftSkus?.length || 0;

        return (
            <WrapEl
                {...(isLovesListPage || {
                    ['aria-label']: getText('loves'),
                    href: getLovesUrl(),
                    onClick: handler
                })}
                css={styles.anchor}
            >
                <div
                    onMouseEnter={this.mouseEnterCallback}
                    css={(shouldDisplayNotification || this.props.shouldShowTotalLoves) && styles.iconWrap}
                >
                    <Icon
                        data-at={Sephora.debug.dataAt(`love_icon${view ? '_' + view : ''}`)}
                        name={isOpen || isLovesListPage ? 'heart' : 'heartOutline'}
                    />
                    {(shouldDisplayNotification || this.props.shouldShowTotalLoves) && !isLovesListPage && !isAnonymousSharable ? (
                        <CountCircle
                            aria-label={totalNotifications === 1 ? getText('item') : getText('items')}
                            key={`inlineLovesCount${totalNotifications}`}
                            data-at={Sephora.debug.dataAt('loves_count')}
                            children={itemLoveCount}
                        />
                    ) : null}
                </div>
            </WrapEl>
        );
    };

    getContent = () => {
        const { loves, limitedLoveListItems, onSaleInLovesList } = this.props;
        const { shouldDisplayOAFLProducts, shouldDisplaySaleProducts, showLovesListSaleNotification, totalNotifications } = this.state;

        if (this.props.disableModal) {
            return null;
        }

        return (
            <Box
                lineHeight='tight'
                paddingX={4}
                paddingTop={4}
                paddingBottom={5}
            >
                {loves?.length > 0
                    ? renderLoves({
                        loves,
                        toggleModal: this.state.isModalOpen ? this.toggleModal : null,
                        limitedLoveListItems,
                        onSaleInLovesList,
                        shouldDisplayOAFLProducts,
                        shouldDisplaySaleProducts,
                        showLovesListSaleNotification,
                        totalNotifications
                    })
                    : renderNoLoves(this.state.isAnonymous)}
            </Box>
        );
    };

    mouseEnterCallback = () => {
        const { shouldDisplayNotification } = this.state;
        const isOnlyAFewLeftNotificationHidden = Storage.session.getItem(LOCAL_STORAGE.HIDE_OAFL_NOTIFICATION);

        if (shouldDisplayNotification && !isOnlyAFewLeftNotificationHidden) {
            this.setState({
                shouldDisplayNotification: false
            });
            Storage.session.setItem(LOCAL_STORAGE.HIDE_OAFL_NOTIFICATION, true);
        }
    };

    handleResize = () => {
        // close the modal if resizing above `xs` breakpoint
        if (this.state.isModalOpen) {
            if (window.matchMedia(breakpoints.smMin).matches) {
                this.toggleModal();
            }
        }
    };

    // Create a signature for a list of loves in the format of
    // 'skuId01:listName01|listName02|listName03,skuId02:listName08|listName09'
    getCurrentLovesSignature({ loves }) {
        return loves
            ?.map(item => {
                const { skuId } = item.sku;
                // Sort listNames to ensure stable ordering
                const listNames = [...item.listNames].sort().join('|');

                return `${skuId}:${listNames}`;
            })
            .sort()
            .join(',');
    }

    // Create a signature for a list of loves lists in the format of
    // 'listId01+listName01:skuId01,skuId02,skuId03|listId02+listName02:skuId67'
    getAllLovesSignature({ allLoves }) {
        if (!Array.isArray(allLoves)) {
            return '';
        }

        const loves = allLoves.map(loveList => {
            const shoppingListId = loveList.shoppingListId;
            const shoppingListName = loveList.shoppingListName;

            const skuIds = loveList.shoppingListItems.map(item => item.sku?.skuId).sort();

            return `${shoppingListId}+${shoppingListName}:${skuIds.join(',')}`;
        });

        return loves.sort().join('|');
    }

    componentDidUpdate(prevProps) {
        if (isSharableListEnabled) {
            const { myLists, user, loves, getAllLists, getLimitedLoveListItems, fetchAllLovedItems, isPerfImprovementEnabled } = this.props;
            const biAccountId = user?.beautyInsiderAccount?.biAccountId;
            // allLoves contains a list of all Love Lists, and each loved
            // sku (with sku details) inside of each list
            const allLoves = myLists?.allLoves;
            // currentLoves contains a list of recently loved skus, ordered by most recently
            // loved first, with the lists they were saved to but not the sku details
            const currentLoves = loves?.currentLoves;
            const prevLoves = prevProps.loves?.currentLoves || Empty.Array;
            const prevAllLoves = prevProps.myLists?.allLoves || Empty.Array;

            if (biAccountId !== prevProps.user?.beautyInsiderAccount?.biAccountId && !this.state.hasFetchedListsData) {
                this.setState({ hasFetchedListsData: true });
                getAllLists({
                    options: {
                        itemsPerPage: isPerfImprovementEnabled ? MIN_ITEMS_PER_PAGE : MAX_ITEMS_PER_PAGE
                    }
                });

                if (!Location.isMyListsPage()) {
                    getLimitedLoveListItems({ options: { itemsPerPage: MAX_ONLY_A_FEW_LEFT_IN_LOVES_LIST_FLYOUT } });
                    fetchAllLovedItems();
                }
            }

            const currentLovesSignature = this.getCurrentLovesSignature({ loves: currentLoves });
            const prevCurrentLovesSignature = this.getCurrentLovesSignature({ loves: prevLoves });
            const allLovesSignature = this.getAllLovesSignature({ allLoves });
            const prevAllLovesSignature = this.getAllLovesSignature({ allLoves: prevAllLoves });

            // Check if the current loves have changed
            if (currentLovesSignature !== prevCurrentLovesSignature || allLovesSignature !== prevAllLovesSignature) {
                const skus = this.populateCurrentLoves({
                    currentLoves: currentLoves.slice(0, MAX_FLYOUT_RECENT_ITEMS),
                    allLoves
                });

                this.setState({
                    skus,
                    currentLoves,
                    myLists: allLoves
                });
            }
        }
    }

    populateCurrentLoves = ({ currentLoves, allLoves }) => {
        const skuDataMap = new Map();

        allLoves.forEach(list => {
            list.shoppingListItems.forEach(({ sku }) => {
                skuDataMap.set(sku.skuId, sku);
            });
        });

        // Build the resulting array in the same order as currentLoves, since
        // we want most recently loved first
        return currentLoves.map(({ sku, listNames }) => {
            const populatedSku = skuDataMap.get(sku.skuId) || {};

            return {
                ...populatedSku,
                skuId: sku.skuId,
                productId: sku.productId,
                transactionDate: sku.transactionDate,
                listNames
            };
        });
    };

    componentDidMount() {
        if (Location.isLovesListPage()) {
            this.setState({
                isLovesListPage: true
            });
        }

        // Watch user - no need to defer this initialization
        store.setAndWatch(
            'user',
            this,
            () => {
                this.setState({
                    isAnonymous: userUtils.isAnonymous()
                });
            },
            true
        );

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            // Execute immediately when UserInfoReady event fires
            const showLoveListNotification = !(localeUtils.isCanada() && !Sephora.isMobile());
            const { user, getAllLists, getLimitedLoveListItems, fetchAllLovedItems, onlyAFewLeftInLovesList, limitedLoveListItems } = this.props;

            if (showLoveListNotification) {
                const totalOnlyAFewLeftLoves = isSharableListEnabled ? limitedLoveListItems.length : onlyAFewLeftInLovesList?.length;
                const totalNotifications = totalOnlyAFewLeftLoves;
                const isOnlyAFewLeftNotificationHidden = Storage.session.getItem(LOCAL_STORAGE.HIDE_OAFL_NOTIFICATION);
                const shouldDisplayNotification = isSharableListEnabled
                    ? limitedLoveListItems.length > 0
                    : totalOnlyAFewLeftLoves > 0 && !isOnlyAFewLeftNotificationHidden;
                const shouldDisplayOAFLProducts = totalOnlyAFewLeftLoves > 0;

                this.setState({
                    totalOnlyAFewLeftLoves,
                    totalNotifications,
                    shouldDisplayNotification,
                    shouldDisplayOAFLProducts
                });
            }

            if (isSharableListEnabled && !this.state.hasFetchedListsData) {
                if (user.beautyInsiderAccount) {
                    getAllLists({
                        force: false,
                        options: { itemsPerPage: MIN_ITEMS_PER_PAGE }
                    });
                    getLimitedLoveListItems({ options: { itemsPerPage: MAX_ONLY_A_FEW_LEFT_IN_LOVES_LIST_FLYOUT } });
                    fetchAllLovedItems();
                    this.setState({ hasFetchedListsData: true });
                }
            }
        });

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady, TestTargetReady], () => {
            // Execute immediately when both events fire - no need to defer
            store.setAndWatch('testTarget', this, newOffers => {
                const showLovesListSaleNotification = !!newOffers.testTarget.offers?.lovesListSaleNotification?.show;

                if (showLovesListSaleNotification) {
                    const { onSaleInLovesList, onlyAFewLeftInLovesList } = this.props;
                    const totalOnSaleLoves = onSaleInLovesList?.length;
                    const totalOnlyAFewLeftLoves = onlyAFewLeftInLovesList?.length;
                    const totalNotifications = totalOnSaleLoves + totalOnlyAFewLeftLoves;
                    const isLovesNotificationHidden = Storage.session.getItem(LOCAL_STORAGE.HIDE_OAFL_NOTIFICATION);
                    const shouldDisplayNotification = totalOnSaleLoves > 0 && !isLovesNotificationHidden;
                    const shouldDisplayOAFLProducts = totalOnlyAFewLeftLoves > 0;
                    const shouldDisplaySaleProducts = totalOnSaleLoves > 0;

                    this.setState({
                        totalOnSaleLoves,
                        totalNotifications,
                        shouldDisplayNotification,
                        shouldDisplayOAFLProducts,
                        shouldDisplaySaleProducts,
                        showLovesListSaleNotification
                    });
                }
            });
        });

        window.addEventListener(DebouncedResize, this.handleResize);

        // Listen for CSF navigation to close modals - https://jira.sephora.com/browse/CSF-446
        window.addEventListener('csfNavigationStarted', this.handleCloseModals);

        // Listen for closeInlineLoves event
        window.addEventListener('closeInlineLoves', this.handleCloseModals);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
        // Unwatch csfNavigationStarted event
        window.removeEventListener('csfNavigationStarted', this.handleCloseModals);
        // Remove closeInlineLoves event listener
        window.removeEventListener('closeInlineLoves', this.handleCloseModals);
    }

    handleCloseModals = () => {
        if (this.state.isModalOpen) {
            this.setState({ isModalOpen: false });
        }
    };
}

const styles = {
    anchor: {
        position: 'relative',
        display: 'flex',
        alignItems: 'center',
        height: site.headerHeight,
        paddingLeft: space[2],
        paddingRight: space[2],
        lineHeight: 0,
        [mediaQueries.sm]: {
            height: '100%',
            paddingTop: space[4],
            paddingBottom: space[4],
            paddingLeft: space[3],
            paddingRight: space[3]
        }
    },
    iconWrap: { position: 'relative' }
};

export default wrapComponent(InlineLoves, 'InlineLoves', true);
