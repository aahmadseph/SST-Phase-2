/* eslint-disable complexity */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import decoratorUtils from 'utils/decorators';
import Empty from 'constants/empty';
import BreadCrumbs from 'components/Catalog/BreadCrumbs';
import ConstructorCarousel from 'components/ConstructorCarousel';
import {
    mediaQueries, space, colors, fontSizes
} from 'style/config';
import { CONSTRUCTOR_PODS, GROUPING } from 'constants/constructorConstants';
import {
    Box, Text, Button, Container, Link, Image, Flex, Icon
} from 'components/ui';
import ProductListLayout from 'components/Content/ProductListLayout';
import locationUtils from 'utils/Location';
import UrlUtils from 'utils/Url';
import { Pages } from 'constants/Pages';
import store from 'store/Store';
import Actions from 'actions/Actions';
import ViewAllLovesBindings from 'analytics/bindingMethods/pages/viewAllLovesBindings/ViewAllLovesBindings';
import MyListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';
import anaConsts from 'analytics/constants';
import { LIST } from 'components/RichProfile/MyLists/MyListsSort/MyListsSortOptions';
import MyListsSort from 'components/RichProfile/MyLists/MyListsSort';
import { LOVES_URL } from 'constants/sharableList';

const { USER_PROFILE } = anaConsts.PAGE_TYPES;
const { LOVES } = anaConsts.EVENT_NAMES;

const sortOptionsList = LIST;
const { showManageListModal, showDeleteListModal } = Actions;

const { showShareLoveListLinkModal } = Actions;
const { GridLayout } = ProductListLayout;

class MyCustomList extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            hasFetchedData: false,
            sortBy: LIST[0].name, // Default sort option
            sortByCode: LIST[0].code
        };
    }

    componentDidMount() {
        const { shoppingListItems } = this.props;
        this.maybeFetchData();
        const skuIds = shoppingListItems.map(i => i.sku.skuId);
        MyListsBindings.pageLoadListDetail({ skuIds });
    }

    componentDidUpdate(prevProps) {
        const { user, myCustomList } = this.props;
        const userChanged = user?.beautyInsiderAccount?.biAccountId !== prevProps.user?.beautyInsiderAccount?.biAccountId;

        const listJustInitialized = myCustomList.isInitialized && myCustomList.isInitialized !== prevProps.myCustomList.isInitialized;

        if (userChanged) {
            this.maybeFetchData();
        }

        if (listJustInitialized) {
            if (myCustomList.isSharedList && !myCustomList.shoppingListId) {
                UrlUtils.redirectTo(Pages.Error404);
            }
        }

        MyListsBindings.stagShareableListPageLoadEvent(myCustomList);
    }

    maybeFetchData() {
        const { user, myCustomList, sharedListToken, fetchData } = this.props;

        const shouldFetch = !this.state.hasFetchedData && !myCustomList.isInitialized && (user?.beautyInsiderAccount?.biAccountId || sharedListToken);

        if (shouldFetch) {
            fetchData({ itemsPerPage: 60 });
            this.setState({ hasFetchedData: true });
        }
    }

    showMoreProductsClicked = () => {
        this.props.fetchData({ itemsPerPage: 60, currentPage: this.state.currentPage + 1, sortBy: this.state.sortByCode });
        this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
    };

    handleNativeShare = async shareUrl => {
        const shareLink = shareUrl + `?om_mmc=share-your-loves&fn=${this.props.encodedFirstName || ''}`;
        const { myCustomList } = this.props;

        if (navigator.share) {
            MyListsBindings.pageLoadShareList({
                pageType: USER_PROFILE,
                eventName: LOVES.LIST_SHARE_YOUR_LIST
            });

            if (myCustomList && typeof myCustomList === 'object') {
                //STAG Analytics
                ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                    eventName: anaConsts.EVENT_NAMES.LOVES.SHAREABLE_LIST_SHARED,
                    shareLoveListUrl: shareLink,
                    shoppingListName: myCustomList?.shoppingListName,
                    shoppingListId: myCustomList?.shoppingListId,
                    ...(myCustomList || {})
                });
            }

            try {
                await navigator.share({
                    url: shareLink
                });
            } catch (error) {
                Sephora.logger.error('Share failed:', error);
            }
        } else {
            Sephora.logger.error('Native share is not supported on this device or browser.');
        }
    };

    launchLovesShareModal = () => {
        const { myCustomList, lovedListName, encodedFirstName } = this.props;
        const shareUrl = myCustomList?.shareLink + `?om_mmc=share-your-loves&fn=${encodedFirstName}`;
        MyListsBindings.pageLoadShareList({
            pageType: USER_PROFILE,
            eventName: LOVES.LIST_SHARE_YOUR_LIST
        });

        store.dispatch(
            showShareLoveListLinkModal({
                isOpen: true,
                shareLoveListUrl: shareUrl,
                loveListName: lovedListName,
                loveListId: myCustomList?.shoppingListId,
                skuIds: myCustomList?.shoppingListItems?.map(i => i.sku.skuId)
            })
        );
    };

    launchManageListModal = () => {
        const { myCustomList, lovedListName } = this.props;

        store.dispatch(showManageListModal({ isOpen: true, listName: lovedListName, loveListId: myCustomList.shoppingListId }));

        if (myCustomList && typeof myCustomList === 'object') {
            //STAG Analytics
            ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
                eventName: anaConsts.EVENT_NAMES.LOVES.SHAREABLE_LIST_EDITED,
                ...(myCustomList || {})
            });
        }
    };

    launchDeleteListModal = () => {
        const { myCustomList } = this.props;
        store.dispatch(showDeleteListModal({ isOpen: true, customListId: myCustomList.shoppingListId }));
    };

    fetchItemsSortBy = option => {
        const { fetchData, setSortByFilter } = this.props;
        fetchData({ force: true, itemsPerPage: 60, currentPage: 1, sortBy: option.code });
        setSortByFilter(option.code);
        this.setState(() => ({
            currentPage: 1,
            sortBy: option.name,
            sortByCode: option.code
        }));
    };

    render() {
        const {
            localization,
            isUserReady,
            myCustomList,
            shoppingListItems,
            shouldShowSignIn,
            shouldShowEditLink,
            shouldShowShareLink,
            shouldShowContent,
            lovedListName,
            lovedListNameBreadCrumbs,
            shouldDisplayShowMoreProducts
        } = this.props;

        const {
            signIn,
            weThinkYouWillLove,
            signInToView,
            myLists,
            edit,
            emptyMessage,
            browseProducts,
            share,
            itemCountText,
            totalLoadedProducts,
            rouge,
            ownerListName,
            sortText,
            cancel
        } = localization;

        const buttonWidth = '18.5em';
        const defaultSortOption = sortOptionsList.find(option => option.code === 'recently');

        const options = sortOptionsList.map(option => ({
            code: option.code,
            children: option.name,
            isActive: this.state.sortBy === option.name,
            onClick: () => this.fetchItemsSortBy(option)
        }));

        return (
            <div>
                {isUserReady && (
                    <Box
                        is='main'
                        css={style.main}
                    >
                        {shouldShowSignIn && (
                            <Container>
                                <Box textAlign='center'>
                                    <Image
                                        src='/img/ufe/loveless.svg'
                                        css={style.image}
                                    />
                                    <Text
                                        is='p'
                                        marginBottom={5}
                                    >
                                        {signInToView}
                                    </Text>
                                    <Button
                                        variant='primary'
                                        onClick={this.props.showSignInModal}
                                        minWidth={buttonWidth}
                                    >
                                        {signIn}
                                    </Button>
                                </Box>
                                <ConstructorCarousel
                                    podId={CONSTRUCTOR_PODS.RFY}
                                    grouping={GROUPING.YMAL}
                                    formatValuePrice={true}
                                    showPrice={true}
                                    showReviews={true}
                                    showLoves={true}
                                    showBadges={true}
                                    showMarketingFlags={true}
                                    showTouts={true}
                                    showArrows={true}
                                    customTitle={weThinkYouWillLove}
                                />
                            </Container>
                        )}

                        {shouldShowContent && (
                            <Container>
                                {myCustomList.isSharedList ? (
                                    <Text
                                        is='h2'
                                        css={style.ownerListName}
                                        children={ownerListName}
                                    />
                                ) : (
                                    <BreadCrumbs
                                        categories={[
                                            {
                                                displayName: lovedListNameBreadCrumbs,
                                                catalogKeyName: lovedListNameBreadCrumbs,
                                                isSelected: true
                                            }
                                        ]}
                                        brand={{
                                            displayName: myLists,
                                            targetUrl: LOVES_URL,
                                            catalogKeyName: lovedListNameBreadCrumbs
                                        }}
                                    />
                                )}
                                <Flex css={style.flexWrapper}>
                                    <Text
                                        is='h2'
                                        css={style.title}
                                        children={lovedListName}
                                    />
                                    {shouldShowShareLink && (
                                        <>
                                            <Link
                                                display={['none', 'block']}
                                                onClick={this.launchLovesShareModal}
                                                css={style.shareLink}
                                            >
                                                <Icon
                                                    name='shareLink'
                                                    css={style.iconShare}
                                                />
                                                {share}
                                            </Link>
                                            <Link
                                                display={['block', 'none']}
                                                onClick={() => this.handleNativeShare(myCustomList.shareLink, lovedListName)}
                                                css={style.shareLink}
                                            >
                                                <Icon
                                                    name='shareLink'
                                                    css={style.iconShare}
                                                />
                                                {share}
                                            </Link>
                                        </>
                                    )}
                                </Flex>
                                {shouldShowEditLink && (
                                    <Box>
                                        <Link
                                            css={style.editLink}
                                            onClick={this.launchManageListModal}
                                            children={edit}
                                        />
                                    </Box>
                                )}
                                {shoppingListItems && shoppingListItems?.length > 0 && (
                                    <Box css={style.sortingWrapper}>
                                        <MyListsSort
                                            options={options}
                                            sortText={sortText}
                                            cancel={cancel}
                                            sortBy={this.state.sortBy}
                                            isActive={this.state.sortByCode !== defaultSortOption.code}
                                        />
                                    </Box>
                                )}
                                <Text
                                    is='span'
                                    css={style.itemCountText}
                                    children={itemCountText}
                                />
                                {shoppingListItems && shoppingListItems?.length > 0 ? (
                                    <Box css={style.gridWrapper}>
                                        <GridLayout
                                            skus={shoppingListItems}
                                            showMarketingFlags
                                            showLovesButton
                                            showRatingWithCount
                                            showQuickLookOnMobile
                                            showPrice
                                            rougeBadgeText={rouge}
                                            showAddButton
                                            size={'xlarge'}
                                            isSharableList
                                            forceDisplayRating
                                            invertPriceAndRatingOrder
                                            showVariationTypeAndValue
                                            gap={[0, 5]}
                                            customCSS={{
                                                ratingWrap: {
                                                    marginTop: space[1]
                                                },
                                                infoWrapPaddingX: {
                                                    [mediaQueries.xsMax]: {
                                                        paddingLeft: space[2],
                                                        paddingRight: space[2]
                                                    }
                                                },
                                                ATB: {
                                                    marginTop: 0
                                                }
                                            }}
                                            analyticsContext={anaConsts.PAGE_NAMES.MY_LISTS}
                                        />
                                    </Box>
                                ) : (
                                    <Box css={[style.imageWrapper, myCustomList.isSharedList && style.sharedListImgWrapper]}>
                                        <Image
                                            src='/img/ufe/loveless.svg'
                                            css={style.image}
                                        />
                                        <Text
                                            is='p'
                                            marginBottom={5}
                                        >
                                            {emptyMessage}
                                        </Text>
                                        <Button
                                            variant='primary'
                                            onClick={e => locationUtils.navigateTo(e, '/beauty/new-beauty-products')}
                                            minWidth={buttonWidth}
                                        >
                                            {browseProducts}
                                        </Button>
                                    </Box>
                                )}
                                {shoppingListItems.length > 0 && (
                                    <Flex css={style.showMoreProducts}>
                                        <Text
                                            is='p'
                                            css={{ ...style.itemCountText, ...style.results }}
                                            children={totalLoadedProducts}
                                        />
                                        {shouldDisplayShowMoreProducts && (
                                            <Button
                                                variant='secondary'
                                                onClick={this.showMoreProductsClicked}
                                            >
                                                {localization.showMoreProducts}
                                            </Button>
                                        )}
                                    </Flex>
                                )}
                                {myCustomList.isSharedList ||
                                    (shoppingListItems.length === 0 && (
                                        <ConstructorCarousel
                                            podId={CONSTRUCTOR_PODS.RFY}
                                            grouping={GROUPING.YMAL}
                                            formatValuePrice={true}
                                            showPrice={true}
                                            showReviews={true}
                                            showLoves={true}
                                            showBadges={true}
                                            showMarketingFlags={true}
                                            showTouts={true}
                                            showArrows={true}
                                            customTitle={weThinkYouWillLove}
                                        />
                                    ))}
                            </Container>
                        )}
                    </Box>
                )}
            </div>
        );
    }
}

const style = {
    main: {
        textAlign: 'left',
        paddingTop: 0
    },
    image: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        size: 128,
        marginTop: space[7],
        marginBottom: space[6]
    },
    flexWrapper: {
        justifyContent: 'space-between',
        alignItems: 'flex-start'
    },
    title: {
        fontSize: fontSizes['xl'],
        fontWeight: 'bold',
        marginBottom: space[1],
        padding: space[0],
        lineHeight: 'tight',
        [mediaQueries.xsMax]: {
            fontSize: fontSizes['lg'],
            flex: 5
        }
    },
    ownerListName: {
        marginTop: space[4],
        marginBottom: space[4]
    },
    iconShare: {
        fontSize: '1.5em',
        marginRight: '.15em'
    },
    shareLink: {
        padding: 2,
        margin: -2,
        [mediaQueries.xsMax]: {
            flex: 2,
            textAlign: 'right'
        }
    },
    editLink: {
        color: colors['blue'],
        padding: space[0]
    },
    sortingWrapper: {
        marginBottom: space[2],
        marginTop: space[2]
    },
    itemCountText: {
        display: 'block',
        color: colors['gray'],
        fontSize: fontSizes['base'],
        marginBottom: space[5],
        [mediaQueries.xsMax]: {
            marginBottom: space[4]
        }
    },
    imageWrapper: {
        textAlign: 'center',
        maxWidth: 470,
        marginLeft: 'auto',
        marginRight: 'auto',
        [mediaQueries.xsMax]: {
            maxWidth: '85%'
        }
    },
    gridWrapper: {
        [mediaQueries.xsMax]: {
            marginLeft: `-${space[1]}px`,
            marginRight: `-${space[4]}px`
        }
    },
    sharedListImgWrapper: {
        maxWidth: 360
    },
    results: {
        marginBottom: space[1]
    },
    showMoreProducts: {
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: space[5],
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 200
    }
};

MyCustomList.propTypes = {
    myCustomList: PropTypes.object,
    sharedListToken: PropTypes.string,
    user: PropTypes.object,
    isUserReady: PropTypes.bool.isRequired,
    shoppingListItems: PropTypes.array.isRequired,
    localization: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    showSignInModal: PropTypes.func.isRequired,
    shouldShowSignIn: PropTypes.bool,
    shouldShowEditLink: PropTypes.bool,
    shouldShowShareLink: PropTypes.bool,
    shouldShowContent: PropTypes.bool,
    shouldDisplayShowMoreProducts: PropTypes.bool
};

MyCustomList.defaultProps = {
    myCustomList: Empty.Object,
    sharedListToken: null,
    user: Empty.Object,
    isUserReady: false,
    shoppingListItems: [],
    localization: Empty.Object,
    shouldShowSignIn: false,
    shouldShowEditLink: false,
    shouldShowShareLink: false,
    shouldShowContent: false,
    shouldDisplayShowMoreProducts: false,
    fetchData: Empty.Function,
    showSignInModal: Empty.Function
};

export default wrapComponent(decoratorUtils.ensureUserIsAtLeastRecognized(MyCustomList), 'MyCustomList', true);
