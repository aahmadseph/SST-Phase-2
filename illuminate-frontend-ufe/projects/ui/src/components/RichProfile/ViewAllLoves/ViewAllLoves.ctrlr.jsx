import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Image, Flex, Text, Icon, Button, Divider, Link
} from 'components/ui';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import IconShare from 'components/LegacyIcon/IconShare';
import ProductSort from 'components/Product/ProductSort/ProductSort';
import ProductListItem from 'components/Product/ProductListItem/ProductListItem';
import * as PRODUCT_SORT_OPTIONS from 'components/Product/ProductSort/ProductSortOptions';
import ListPageHeader from 'components/RichProfile/ListPageHeader/ListPageHeader';
import CountCircle from 'components/CountCircle';
import { HEADER_VALUE } from 'constants/authentication';

import auth from 'utils/Authentication';
import userUtils from 'utils/User';
import helpersUtils from 'utils/Helpers';
import Location from 'utils/Location';
import store from 'store/Store';
import ProductActions from 'actions/ProductActions';
import LoveActions from 'actions/LoveActions';
import profileApi from 'services/api/profile';
import Flush from 'utils/localStorage/Flush';
import Actions from 'actions/Actions';
import urlUtil from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';
import basketUtils from 'utils/Basket';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import viewAllLovesBindings from 'analytics/bindingMethods/pages/viewAllLovesBindings/ViewAllLovesBindings';
import { UserInfoReady } from 'constants/events';
import myListsUtils from 'utils/MyLists';
import { Pages } from 'constants/Pages';
const { deferTaskExecution } = helpersUtils;
import Empty from 'constants/empty';
const { showShareLinkModal } = Actions;
const NUMBER_OF_LOVES_PER_PAGE = 10;
const ITEMS_COUNT_PER_CALL_FROM_API = 100;
const SORT_DESCRIBEDBY_ID = 'lovesSortDescription';

const getText = localeUtils.getLocaleResourceFile('components/RichProfile/ViewAllLoves/locales', 'ViewAllLoves');

class ViewAllLoves extends BaseClass {
    state = {
        isPublicLovesList: null,
        token: 0,
        shareLink: null,
        APILimit: 100,
        isLoggedIn: false,
        isAnonymous: false,
        lovesDisplayed: [],
        shouldShowMore: false,
        displayedCount: 0,
        currentPage: 1,
        selectedSortOption: PRODUCT_SORT_OPTIONS.RECENTLY.code,
        trackCode: '',
        totalNotifications: 0
    };

    componentDidMount() {
        const isPublicLovesList = Location.isPublicLovesPage();

        if (isPublicLovesList) {
            const token = this.getTokenFromPathname();
            this.getNextItemsOfLovesList({
                token,
                isPublicLovesList,
                isFirstPage: true
            });
            this.setState({
                isPublicLovesList,
                token
            });
            Flush.flushUser();
            store.setAndWatch('loves.publicLoves', this, data => {
                if (data.publicLoves && data.publicLoves.length) {
                    this.displayLovesList(data.publicLoves);
                } else {
                    this.resetLovesState();
                }
            });
        } else {
            store.setAndWatch('loves.currentLoves', this, data => {
                if (data.currentLoves && data.currentLoves.length) {
                    this.displayLovesList(data.currentLoves);
                } else {
                    this.resetLovesState();
                }
            });
        }

        store.setAndWatch(
            'loves.totalLovesListItemsCount',
            this,
            ({ totalLovesListItemsCount }) => {
                if (!totalLovesListItemsCount > 0) {
                    return;
                }

                const { lovesDisplayed } = this.state;
                const shouldShowMore = this.shouldShowMore(lovesDisplayed, totalLovesListItemsCount);
                this.setState({ shouldShowMore });
            },
            1
        );
        store.setAndWatch('loves.shareLink', this, null, true);

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            store.setAndWatch('user', this, () => {
                const isAnonymous = userUtils.isAnonymous();
                this.setState({
                    isLoggedIn: !isAnonymous,
                    isAnonymous: isAnonymous
                });
            });
        });

        store.watchAction(ProductActions.TYPES.SELECT_SORT_OPTION, data => this.handleSortOptionChange(data.sortOption.code));

        //Analytics - ILLUPH-101467
        digitalData.page.category.pageType = 'user profile';
        digitalData.page.pageInfo.pageName = 'lists-loves';

        Sephora.Util.onLastLoadEvent(window, [UserInfoReady], () => {
            const showLoveListNotification = !(localeUtils.isCanada() && !Sephora.isMobile());

            if (showLoveListNotification) {
                const { onlyAFewLeftInLovesList } = this.props;
                const totalOnlyAFewLeftLoves = onlyAFewLeftInLovesList?.length || 0;
                const totalNotifications = onlyAFewLeftInLovesList?.length || 0;
                const shouldDisplayOAFLProducts = totalOnlyAFewLeftLoves > 0;

                this.setState(
                    {
                        totalNotifications,
                        shouldDisplayOAFLProducts
                    },
                    () => {
                        if (!isPublicLovesList) {
                            store.setAndWatch('loves.currentLoves', this, data => {
                                if (data.currentLoves && data.currentLoves.length) {
                                    this.displayLovesList(data.currentLoves);
                                } else {
                                    this.resetLovesState();
                                }
                            });
                        }
                    }
                );
            }

            this.fireViewItemListAnalytics();
        });
    }

    componentDidUpdate(prevProps) {
        if (this.props.loves?.currentLoves?.length > prevProps.loves?.currentLoves?.length) {
            this.triggerSOTAnalytics();
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.onlyAFewLeftInLovesList?.length > 0 && nextProps.onlyAFewLeftInLovesList !== this.props.onlyAFewLeftInLovesList) {
            this.setState(() => ({
                totalOnlyAFewLeftLoves: nextProps.onlyAFewLeftInLovesList?.length,
                shouldDisplayOAFLProducts: nextProps.onlyAFewLeftInLovesList?.length > 0,
                totalNotifications: nextProps.onlyAFewLeftInLovesList?.length || 0
            }));
        }
    }

    triggerSOTAnalytics() {
        const allOutOfStockLoves = [],
            allInStockLoves = [];

        if (Array.isArray(this.props.loves.currentLoves)) {
            this.props.loves.currentLoves.forEach(lovedProduct => {
                if (lovedProduct.isOutOfStock === true) {
                    allOutOfStockLoves.push(lovedProduct);
                } else {
                    allInStockLoves.push(lovedProduct);
                }
            });
            digitalData.page.attributes.productStrings = this.props.loves.currentLoves
                .map(item => `;${item.sku.skuId};;;;eVar26=${item.sku.skuId}`)
                .toString();
        }

        digitalData.page.pageInfo.totalLovesCount = this.state.totalLovesListItemsCount;
        digitalData.page.pageInfo.totalBasketCount = basketUtils.getTotalBasketCount();
        digitalData.page.pageInfo.totalInStockCount = allInStockLoves.length;
        digitalData.page.pageInfo.totalOutOfStockCount = allOutOfStockLoves.length;
    }

    handleShowMoreClick = () => {
        let currentLovedItems;
        const totalLovesListItemsCount = this.state.totalLovesListItemsCount;

        if (this.state.isPublicLovesList) {
            currentLovedItems = this.getLovesFromStore('publicLoves');
        } else {
            currentLovedItems = this.getLovesFromStore('currentLoves');
        }

        // Get the next set of Loved'd SKU's to display from the full list.
        const lovedItemsToDisplay = currentLovedItems.slice(this.state.displayedCount, this.state.displayedCount + NUMBER_OF_LOVES_PER_PAGE);

        // Add the new Loved SKU's to already displayed list.
        let updatedLovesList = this.state.lovesDisplayed.concat(lovedItemsToDisplay);
        const updatedDisplayCount = (this.state.displayedCount || 0) + NUMBER_OF_LOVES_PER_PAGE;

        // ILLUPH-109120: hide all inactive skus from love list
        updatedLovesList = this.getActiveSkus(updatedLovesList);

        const shouldShowMore = this.shouldShowMore(updatedLovesList, totalLovesListItemsCount);

        this.setState(
            {
                lovesDisplayed: updatedLovesList,
                displayedCount: updatedDisplayCount,
                shouldShowMore
            },
            this.checkIfAPICallNeeded(updatedDisplayCount)
        );
    };

    shouldShowMore = (displayedLovesList, totalLovesListItemsCount) => {
        const { totalNotifications, shouldDisplayOAFLProducts } = this.state;

        return shouldDisplayOAFLProducts
            ? (displayedLovesList.length || 0) + totalNotifications < totalLovesListItemsCount
            : displayedLovesList.length < totalLovesListItemsCount;
    };

    checkIfAPICallNeeded = updatedDisplayCount => {
        if (this.state.totalLovesListItemsCount < this.state.APILimit) {
            return;
        }

        const hasReachedPageLimit = updatedDisplayCount === this.state.APILimit;

        if (hasReachedPageLimit) {
            const options = this.state.isPublicLovesList
                ? {
                    token: this.state.token,
                    sortBy: this.state.selectedSortOption,
                    isPublicLovesList: this.state.isPublicLovesList
                }
                : { sortBy: this.state.selectedSortOption };
            this.getNextItemsOfLovesList(options);
        }
    };

    signInHandler = e => {
        e.stopPropagation();
        auth.requireAuthentication(false, null, null, null, false, HEADER_VALUE.USER_CLICK).catch(() => {});
    };

    getTokenFromPathname = () => {
        const pathArray = Location.getLocation(true).pathname.split('/');

        return pathArray[2];
    };

    getLovesListItemsFromStoreCount = () => {
        let lovesListItemsFromStore;

        if (this.state.isPublicLovesList) {
            lovesListItemsFromStore = this.getLovesFromStore('publicLoves');
        } else {
            lovesListItemsFromStore = this.getLovesFromStore('currentLoves');
        }

        return this.getActiveSkus(lovesListItemsFromStore).length;
    };

    getLovesFromStore = (listName, noMap = false) => {
        const loves = store.getState().loves[listName];

        if (noMap) {
            return loves.map(love => love);
        }

        return loves.map(love => {
            if (love.sku) {
                return love.sku;
            } else {
                return love;
            }
        });
    };

    dispatchUpdatedLoves = (updatedLovesList, data) => {
        const updatedLovesData = {
            loves: updatedLovesList,
            shareLink: this.state.isPublicLovesList ? null : data.shareLink
        };

        if (this.state.isPublicLovesList) {
            updatedLovesData.totalPublicLovesListItemsCount = data.shoppingListItemsCount;
            store.dispatch(LoveActions.updatePublicLovesList(updatedLovesData));
        } else {
            updatedLovesData.totalLovesListItemsCount = data.shoppingListItemsCount;
            store.dispatch(LoveActions.updateLovesList(updatedLovesData));
            store.dispatch(LoveActions.updateLovesSorting(this.state.selectedSortOption));
        }
    };

    getNextItemsOfLovesList = options => {
        const isFirstPage = options.isFirstPage || false;
        let { APILimit = 0 } = this.state;
        let currentPage = options.isPublicLovesList ? 1 : this.state.currentPage;

        currentPage = currentPage + 1;
        APILimit = APILimit + ITEMS_COUNT_PER_CALL_FROM_API;

        if (isFirstPage) {
            APILimit = ITEMS_COUNT_PER_CALL_FROM_API;
            currentPage = 1;
        }

        options.itemsPerPage = ITEMS_COUNT_PER_CALL_FROM_API;
        options.currentPage = currentPage;

        profileApi
            .getShoppingList(userUtils.getProfileId(), options, this.props.isSLSTestEnabled)
            .then(data => {
                const isSharableListEnabled = myListsUtils.isSharableListEnabled();
                const shouldRedirectTo404 = !isSharableListEnabled && !data.isDefault;

                if (shouldRedirectTo404) {
                    urlUtil.redirectTo(Pages.Error404);

                    return;
                }

                const ids = this.state.lovesDisplayed && this.state.lovesDisplayed.map(item => item.skuId);
                const shoppingListItems = data.shoppingListItems && data.shoppingListItems.filter(item => !ids.includes(item.sku.skuId));
                const currentLovedItems = this.getLovesFromStore('currentLoves', true);
                const updatedLovesList = isFirstPage
                    ? this.state.lovesDisplayed.concat(shoppingListItems)
                    : currentLovedItems.concat(shoppingListItems);

                const shouldShowMore = this.shouldShowMore(this.state.lovesDisplayed, data.shoppingListItemsCount);
                this.dispatchUpdatedLoves(updatedLovesList, data);
                this.setState({
                    currentPage,
                    shouldShowMore,
                    APILimit
                });
            })
            .catch(() => urlUtil.redirectTo('/shopping-list'));
    };

    extractSkus = loves => {
        return loves.map(love => {
            if (love.sku) {
                return love.sku;
            } else {
                return love;
            }
        });
    };

    displayLovesList = LovedItems => {
        const { shouldDisplayOAFLProducts, totalLovesListItemsCount } = this.state;

        // We need to keep count of how many loved SKU's are already displayed
        const displayNext = this.state.displayedCount > NUMBER_OF_LOVES_PER_PAGE ? this.state.displayedCount : NUMBER_OF_LOVES_PER_PAGE;
        const lovedSKUs = LovedItems.map(love => {
            if (love.sku) {
                return love.sku;
            } else {
                return love;
            }
        });

        // Show incremental loves per limit on page.
        const lovedItemsToDisplay = lovedSKUs.slice(0, displayNext);

        // ILLUPH-109120: hide all inactive skus from love list
        let uniqueList = this.getActiveSkus(lovedItemsToDisplay);
        uniqueList = shouldDisplayOAFLProducts ? uniqueList.filter(love => !this.props.onlyAFewLeftInLovesList?.includes(love)) : uniqueList;

        const shouldShowMore = this.shouldShowMore(uniqueList, totalLovesListItemsCount);

        this.setState({
            lovesDisplayed: uniqueList,
            displayedCount: displayNext,
            shouldShowMore
        });
    };

    resetLovesState = () => {
        this.setState({
            lovesDisplayed: [],
            displayedCount: 0,
            shouldShowMore: false,
            currentPage: 1
        });
    };

    handleSortOptionChange = code => {
        this.setState(
            state => {
                return {
                    ...state,
                    selectedSortOption: code,
                    trackCode: state.trackCode !== code ? code : ''
                };
            },
            () => {
                this.getSortedLovesList(code);

                if (this.state.trackCode !== code) {
                    processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
                        data: {
                            pageName: digitalData.page.attributes.sephoraPageInfo.pageName,
                            pageDetail: digitalData.page.pageInfo.pageName,
                            pageType: digitalData.page.category.pageType,
                            categoryFilters: ['sortby=' + code]
                        }
                    });
                }
            }
        );
    };

    getSortedLovesList = code => {
        this.resetLovesState();
        const options = this.state.isPublicLovesList
            ? {
                token: this.state.token,
                sortBy: code,
                isPublicLovesList: true,
                isFirstPage: true
            }
            : { sortBy: code, isFirstPage: true };
        this.getNextItemsOfLovesList(options);
    };

    launchLovesShareModal = () => {
        const shareLink = this.state.shareLink || store.getState().loves.shareLink;
        const shareUrl = shareLink + '?om_mmc=share-your-loves';
        const subTitle = getText('copyLinkAndShare');
        store.dispatch(showShareLinkModal(true, getText('yourLoves'), shareUrl, subTitle));

        viewAllLovesBindings.shareClick();

        processEvent.process(anaConsts.ASYNC_PAGE_LOAD, {
            data: {
                pageName: 'user profile:lists-share your loves:n/a:*',
                pageDetail: 'lists-share your loves',
                pageType: anaConsts.PAGE_TYPES.USER_PROFILE
            }
        });
    };

    getActiveSkus = lovesList => {
        return lovesList.filter(function (sku) {
            return sku.isActive;
        });
    };

    fireViewItemListAnalytics = () => {
        const loves = this.state?.lovesDisplayed || Empty.Array;
        const itemsInList = loves.map(item => {
            return {
                skuId: item?.skuId,
                productName: item?.productName,
                brandName: item?.brandName,
                category: item?.topCategory
            };
        });

        const analyticsData = {
            data: {
                listId: '',
                listName: 'loves',
                items: itemsInList
            }
        };

        deferTaskExecution(() => {
            // Dispatches the View List Event
            processEvent.process(anaConsts.VIEW_LIST_EVENT, analyticsData);
        });
    };

    // eslint-disable-next-line complexity
    render() {
        const isMobile = Sephora.isMobile();
        const { loves = [], onlyAFewLeftInLovesList = [] } = this.props;
        const { lovesDisplayed, shouldDisplayOAFLProducts, totalNotifications, isLoggedIn } = this.state;
        const buttonWidth = '16em';

        const recentlyLovedList = shouldDisplayOAFLProducts ? lovesDisplayed.filter(love => !onlyAFewLeftInLovesList.includes(love)) : lovesDisplayed;
        const showRecentlyLovedList = recentlyLovedList?.length > 0;
        const headerCopy = 'getTheseBeforeTheyAreGone';

        const emptyLovesList = (
            <Box textAlign='center'>
                <Image
                    src='/img/ufe/loveless.svg'
                    display='block'
                    marginX='auto'
                    size={128}
                    marginTop={7}
                    marginBottom={6}
                />
                <Text
                    is='p'
                    maxWidth='25em'
                    marginX='auto'
                >
                    <b>{getText('noLoves')}</b>
                    <br />
                    {getText('collectAllYourFavorites')}{' '}
                    <Icon
                        css={{ verticalAlign: 'middle' }}
                        size='1.25em'
                        name='heartOutline'
                    />{' '}
                    {getText('whileYouShop')}
                </Text>
            </Box>
        );

        const signinRequired = (
            <Box textAlign='center'>
                <Image
                    src='/img/ufe/loveless.svg'
                    display='block'
                    marginX='auto'
                    size={128}
                    marginTop={7}
                    marginBottom={6}
                />
                <Text
                    is='p'
                    marginBottom={5}
                >
                    <b>{getText('youHaveToSignIn')}</b>
                    <br />
                    {getText('signInToViewAllYourFav')}
                </Text>
                <Button
                    variant='primary'
                    onClick={this.signInHandler}
                    minWidth={buttonWidth}
                >
                    {getText('signIn')}
                </Button>
            </Box>
        );

        // We have to check if its a sort change to stop the flash of emptyLovesList
        // while we reset store to get loves list with the new sort option from backend.
        const sortOptionChanged = this.state.selectedSortOption !== PRODUCT_SORT_OPTIONS.RECENTLY.code;

        const hasLoves = (loves && loves.length > 0) || recentlyLovedList.length > 0;
        const selectedOption = PRODUCT_SORT_OPTIONS.LIST.find(option => option?.code === this.state.selectedSortOption);
        const selectedOptionTitle = selectedOption.code === PRODUCT_SORT_OPTIONS.RECENTLY.code ? getText('recentlyLoved') : selectedOption?.name;

        return (
            <main>
                <ListPageHeader
                    showFavBrandSpoke={isLoggedIn}
                    children={getText(this.state.isPublicLovesList ? 'sharedLoves' : 'loves')}
                />
                <LegacyContainer data-at={Sephora.debug.dataAt('loves_page_product_container')}>
                    {this.state.isAnonymous && !this.state.isPublicLovesList && signinRequired}

                    {this.state.isLoggedIn && !hasLoves && !sortOptionChanged && emptyLovesList}

                    {hasLoves && (
                        <Flex
                            alignItems='center'
                            justifyContent='space-between'
                        >
                            <Box fontWeight='bold'>
                                {this.state.isPublicLovesList || (
                                    <Link
                                        onClick={this.launchLovesShareModal}
                                        padding={2}
                                        margin={-2}
                                    >
                                        <IconShare
                                            fontSize='1.5em'
                                            marginRight='.5em'
                                        />
                                        {getText('share')}
                                    </Link>
                                )}
                            </Box>
                            {loves && (
                                <ProductSort
                                    currentSortSelected={this.state.selectedSortOption}
                                    sortOptions={PRODUCT_SORT_OPTIONS.LIST}
                                    ariaDescribedById={SORT_DESCRIBEDBY_ID}
                                    ariaDescribedByText={getText('sortDescribedByText')}
                                />
                            )}
                        </Flex>
                    )}
                    {shouldDisplayOAFLProducts && (
                        <>
                            <Divider marginY={4} />
                            <Text
                                fontWeight='bold'
                                display='flex'
                                alignItems='center'
                            >
                                {getText(headerCopy)}
                                {totalNotifications > 0 && (
                                    <CountCircle
                                        marginLeft={2}
                                        top={0}
                                        right={0}
                                        position='static'
                                        key={`inlineLovesCount${totalNotifications}`}
                                        children={totalNotifications}
                                    />
                                )}
                            </Text>
                            {onlyAFewLeftInLovesList &&
                                onlyAFewLeftInLovesList.map(item => (
                                    <div
                                        key={item.commerceId}
                                        data-at={Sephora.debug.dataAt('product_list_item')}
                                    >
                                        <Divider marginY={4} />
                                        <ProductListItem
                                            sku={item}
                                            isPublicLovesList={this.state.isPublicLovesList}
                                            productStringContainerName={'loves list'}
                                            rootContainerName={'loves list'}
                                            shouldDisplayOnlyFewLeftFlag={shouldDisplayOAFLProducts && item?.isOnlyFewLeft}
                                            isLovedItemList={true}
                                        />
                                    </div>
                                ))}
                            {showRecentlyLovedList && (
                                <>
                                    <Divider marginY={4} />
                                    <Text
                                        fontWeight='bold'
                                        display='flex'
                                        alignItems='center'
                                        children={selectedOptionTitle}
                                    />
                                </>
                            )}
                        </>
                    )}
                    {showRecentlyLovedList &&
                        recentlyLovedList.map(item => (
                            <div
                                key={item.commerceId}
                                data-at={Sephora.debug.dataAt('product_list_item')}
                            >
                                <Divider marginY={4} />
                                <ProductListItem
                                    sku={item}
                                    isPublicLovesList={this.state.isPublicLovesList}
                                    productStringContainerName={'loves list'}
                                    rootContainerName={'loves list'}
                                    isLovedItemList={true}
                                />
                            </div>
                        ))}
                    {this.state.shouldShowMore && (
                        <Box textAlign='center'>
                            <Divider
                                marginTop={4}
                                marginBottom={5}
                            />
                            <Button
                                variant='secondary'
                                block={isMobile}
                                minWidth={buttonWidth}
                                onClick={this.handleShowMoreClick}
                                children={getText('showMore')}
                            />
                        </Box>
                    )}
                </LegacyContainer>
            </main>
        );
    }
}

export default wrapComponent(ViewAllLoves, 'ViewAllLoves', true);
