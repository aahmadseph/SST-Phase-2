/* eslint-disable no-console */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import decoratorUtils from 'utils/decorators';
import {
    site, mediaQueries, space, colors, fontSizes, lineHeights
} from 'style/config';
import Empty from 'constants/empty';
import ConstructorCarousel from 'components/ConstructorCarousel';
import { CARD_WIDTH } from 'constants/productCard';
import { CONSTRUCTOR_PODS, GROUPING } from 'constants/constructorConstants';
import {
    Box, Text, Button, Container, Link, Image, Flex
} from 'components/ui';
import ViewAllLovesBindings from 'analytics/bindingMethods/pages/viewAllLovesBindings/ViewAllLovesBindings';
import RecapLists from 'components/Content/Recap/RecapLists/RecapLists';
import Carousel from 'components/Carousel';
import anaConsts from 'analytics/constants.js';
import ProductListLayout from 'components/Content/ProductListLayout';
import * as MY_LISTS_SORT_OPTIONS from 'components/RichProfile/MyLists/MyListsSort/MyListsSortOptions';
import MyListsSort from 'components/RichProfile/MyLists/MyListsSort';
import GrabFavoritesSoonCarousel from 'components/RichProfile/MyLists/GrabFavoritesSoonCarousel';
import MyListsBindings from 'analytics/bindingMethods/components/globalModals/myLists/myListsBindings';
const sortOptionsList = MY_LISTS_SORT_OPTIONS.LIST;
import Pill from 'components/Pill';
import { RECENT_ITEMS_PAGINATION_SIZE } from 'constants/sharableList';
const { GridLayout } = ProductListLayout;

class Lists extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            currentPage: 1,
            isOnSaleActive: false,
            hasFetchedFlatData: false,
            hasFetchedLowInStockData: false,
            sortByCode: 'recently',
            sortBy: props.localization.recentlyAdded // Default sort option
        };
    }

    componentDidMount() {
        this.maybeFetchFlatData();
    }

    componentDidUpdate(prevProps) {
        const { user, myLists, getLimitedLoveListItems, getLimitedLoveListCount } = this.props;
        const userChanged = user?.beautyInsiderAccount?.biAccountId !== prevProps.user?.beautyInsiderAccount?.biAccountId;

        if (userChanged) {
            this.maybeFetchFlatData();
        }

        if (
            (prevProps.totalLovesListItemsCount !== this.props.totalLovesListItemsCount || !this.state.hasFetchedLowInStockData) &&
            user?.beautyInsiderAccount?.biAccountId
        ) {
            let previousHasFetched = false;
            this.setState(
                prevState => {
                    previousHasFetched = prevState.hasFetchedLowInStockData;

                    return { hasFetchedLowInStockData: true };
                },
                () => {
                    if (!previousHasFetched) {
                        getLimitedLoveListCount().then(data => {
                            const refreshCache =
                                !data || data?.fault || (data.totalSkus > 0 && data.totalSkus > data.skus.length && data.skus.length < 10);

                            getLimitedLoveListItems({
                                refreshCache
                            });
                        });
                    }
                }
            );
        }

        MyListsBindings.stagShareableListPageLoadEvent(myLists);
    }

    handleOnSaleClick = () => {
        const { fetchAllLovedItems, setSaleFilter } = this.props;
        setSaleFilter(!this.state.isOnSaleActive);

        const optionsToPass = {
            force: true,
            options: { itemsPerPage: 60, currentPage: 1, sortBy: this.state.sortByCode },
            callback: () => {
                this.setState(prevState => ({
                    currentPage: 1,
                    isOnSaleActive: !prevState.isOnSaleActive
                }));
            }
        };

        if (!this.state.isOnSaleActive) {
            optionsToPass.options.filterType = 'onSale';
        }

        fetchAllLovedItems(optionsToPass);
    };

    handleCreateNewList() {
        this.props.showMyListsModal(true, true);
        //STAG Analytics
        ViewAllLovesBindings.triggerSOTLinkTrackingAnalytics({
            eventName: anaConsts.EVENT_NAMES.LOVES.CREATE_NEW_LIST
        });
    }

    maybeFetchFlatData() {
        const { user, myLists, fetchAllLovedItems } = this.props;
        const { sortByCode, currentPage } = this.state;

        const shouldFetch = !this.state.hasFetchedFlatData && !myLists.isInitialized && user?.beautyInsiderAccount?.biAccountId;

        if (shouldFetch) {
            fetchAllLovedItems({ force: true, options: { itemsPerPage: RECENT_ITEMS_PAGINATION_SIZE, currentPage, sortBy: sortByCode } });

            this.setState({ hasFetchedFlatData: true });
        }
    }

    showMoreProductsClicked = () => {
        const { fetchAllLovedItems, user, shouldCallToGetMoreLovesList, fetchData } = this.props;
        const { sortByCode, currentPage } = this.state;

        fetchAllLovedItems({ force: true, options: { itemsPerPage: 60, currentPage: currentPage + 1, sortBy: sortByCode } });

        if (shouldCallToGetMoreLovesList) {
            fetchData({
                biAccountId: user.beautyInsiderAccount.biAccountId,
                invalidate: true,
                options: {
                    currentPage: currentPage + 1,
                    itemsPerPage: 60
                }
            });
        }

        this.setState(prevState => ({ currentPage: prevState.currentPage + 1 }));
    };

    fetchItemsSortBy = option => {
        const { fetchAllLovedItems, setSortByFilter } = this.props;
        const optionsToPass = {
            force: true,
            options: { itemsPerPage: 60, currentPage: 1, sortBy: option.code }
        };

        if (this.state.isOnSaleActive) {
            optionsToPass.options.filterType = 'onSale';
        }

        setSortByFilter(option.code);
        fetchAllLovedItems(optionsToPass);
        this.setState(() => ({
            currentPage: 1,
            sortBy: option.name,
            sortByCode: option.code
        }));
    };

    render() {
        const {
            localization,
            isUserAtleastRecognized,
            isUserReady,
            isEmptyState,
            allLovesFlatList,
            totalLovesListItemsCount,
            totalLoadedProductsText,
            limitedLoveListItems
        } = this.props;

        const shouldDisplayShowMoreProducts = !isEmptyState && this.state.currentPage * 60 < totalLovesListItemsCount;
        const options = sortOptionsList.map(option => ({
            code: option.code,
            children: option.name,
            isActive: this.state.sortBy === option.name,
            onClick: () => this.fetchItemsSortBy(option)
        }));

        const {
            createNewList,
            signIn,
            weThinkYouWillLove,
            signInToView,
            myLists,
            showMoreProducts,
            allSavedItems,
            sortText,
            cancel,
            getTheseBeforeGone,
            sale,
            emptySaleFilter
        } = localization;

        const defaultSortOption = sortOptionsList.find(option => option.code === 'recently');

        const buttonWidth = '18.5em';
        const isLoveListsEmpty = this.props.myLists?.allLoves.length > 0 && !this.props?.myLists?.allLoves.some(obj => obj.shoppingListId);

        return (
            <div>
                {isUserReady && (
                    <Box
                        is='main'
                        css={style.alignLeft}
                    >
                        <Box css={style.mainWrapper}>
                            {isUserAtleastRecognized || (
                                <Container>
                                    <Text
                                        is='h2'
                                        css={style.title}
                                    />
                                    <Box css={style.alignCenter}>
                                        <Image
                                            src='/img/ufe/loveless.svg'
                                            css={style.image}
                                        />
                                        <Text
                                            is='p'
                                            css={style.signInText}
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
                                        grouping={GROUPING.PERSONALIZED_PICKS}
                                        customTitle={weThinkYouWillLove}
                                    />
                                </Container>
                            )}

                            {isUserAtleastRecognized && (
                                <Container css={style.container}>
                                    <Flex css={style.titleWrapper}>
                                        <Text
                                            is='h2'
                                            css={style.title}
                                            children={myLists}
                                        />
                                        <Box>
                                            <Link
                                                css={style.blueLink}
                                                onClick={this.handleCreateNewList.bind(this)}
                                                children={createNewList}
                                            />
                                        </Box>
                                    </Flex>
                                    <Box
                                        maxWidth={['auto', site.containerMax]}
                                        marginX={['-container', 0]}
                                    >
                                        <Carousel
                                            isLoading={!this.props.myLists.isInitialized}
                                            gap={3}
                                            paddingY={4}
                                            marginX={[0, '-container']}
                                            scrollPadding={'container'}
                                            itemWidth={CARD_WIDTH}
                                            hasShadowHack={true}
                                            showArrowOnHover={false}
                                            recapList={true}
                                            items={this.props.myLists?.allLoves?.map(list => (
                                                <RecapLists
                                                    sid='myLists'
                                                    isCreateList={list.isCreateList}
                                                    actionForCreateList={() => this.props.showMyListsModal(true, true)}
                                                    isLoveListsEmpty={isLoveListsEmpty}
                                                    title={list.shoppingListName}
                                                    subtitle={`${list.shoppingListItemsCount || 0} ${
                                                        list.shoppingListItemsCount === 1 ? localization.item : localization.items
                                                    }`}
                                                    isLoading={!this.props.myLists.isInitialized}
                                                    currentLoves={list.shoppingListItems?.slice(0, 4) || []}
                                                    recapList={true}
                                                    targetUrl={`/profile/Lists/${list.shoppingListId}`}
                                                />
                                            ))}
                                        />
                                        {limitedLoveListItems.length > 0 && (
                                            <Box
                                                marginX={['container', 0]}
                                                maxWidth={['auto', site.containerMax]}
                                            >
                                                <GrabFavoritesSoonCarousel
                                                    skuList={limitedLoveListItems}
                                                    titleText={getTheseBeforeGone}
                                                />
                                            </Box>
                                        )}

                                        {isEmptyState && !this.state.isOnSaleActive ? (
                                            <Box
                                                marginX={['container', 0]}
                                                maxWidth={['auto', site.containerMax]}
                                            >
                                                <ConstructorCarousel
                                                    podId={CONSTRUCTOR_PODS.RFY}
                                                    grouping={GROUPING.PERSONALIZED_PICKS}
                                                    customTitle={weThinkYouWillLove}
                                                    showArrowOnHover={false}
                                                    marginX={['container', '-container']}
                                                    marginLeft={'container'}
                                                    scrollPadding={'container'}
                                                    hasShadowHack={true}
                                                    gap={3}
                                                />
                                            </Box>
                                        ) : (
                                            <Box css={style.allSavedWrapper}>
                                                <Text
                                                    is='h3'
                                                    css={style.allItems}
                                                    children={allSavedItems}
                                                />
                                                <Flex css={style.sortingWrapper}>
                                                    <MyListsSort
                                                        options={options}
                                                        sortText={sortText}
                                                        cancel={cancel}
                                                        sortBy={this.state.sortBy}
                                                        isActive={this.state.sortByCode !== defaultSortOption.code}
                                                    />
                                                    <Pill
                                                        onClick={this.handleOnSaleClick}
                                                        isActive={this.state.isOnSaleActive}
                                                        css={style.pillSort}
                                                        children={sale}
                                                    />
                                                </Flex>
                                                {this.state.isOnSaleActive && isEmptyState && (
                                                    <Box>
                                                        <Text
                                                            is='p'
                                                            fontWeight='bold'
                                                        >
                                                            {emptySaleFilter}
                                                        </Text>
                                                    </Box>
                                                )}
                                                <GridLayout
                                                    skus={allLovesFlatList.slice(0, 60 * this.state.currentPage) || []}
                                                    showMarketingFlags
                                                    showLovesButton
                                                    showRatingWithCount
                                                    showQuickLookOnMobile
                                                    showPrice
                                                    showVariationTypeAndValue
                                                    rougeBadgeText={'rouge'}
                                                    showAddButton
                                                    size={'xlarge'}
                                                    isSharableList
                                                    forceDisplayRating
                                                    invertPriceAndRatingOrder
                                                    gap={[0, 5]}
                                                    customCSS={style.customCSS}
                                                    analyticsContext={anaConsts.PAGE_NAMES.MY_LISTS}
                                                />
                                                <Flex css={style.showMoreProducts}>
                                                    <Text
                                                        is='p'
                                                        css={{ ...style.itemCountText, ...style.results }}
                                                        children={totalLoadedProductsText}
                                                    />
                                                    {shouldDisplayShowMoreProducts && (
                                                        <Button
                                                            variant='secondary'
                                                            onClick={this.showMoreProductsClicked}
                                                        >
                                                            {showMoreProducts}
                                                        </Button>
                                                    )}
                                                </Flex>
                                            </Box>
                                        )}
                                    </Box>
                                </Container>
                            )}
                        </Box>
                    </Box>
                )}
            </div>
        );
    }
}

const style = {
    customCSS: {
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
    },
    container: {
        paddingLeft: 0,
        paddingRight: 0
    },
    alignLeft: {
        textAlign: 'left'
    },
    alignCenter: {
        textAlign: 'center'
    },
    signInText: {
        marginBottom: space[5]
    },
    mainWrapper: {
        paddingRight: space[4],
        paddingLeft: space[4],
        paddingTop: space[6],
        paddingBottom: space[6],
        [mediaQueries.xsMax]: {
            paddingRight: space[3],
            paddingLeft: space[3],
            paddingTop: space[5],
            paddingBottom: space[5]
        }
    },
    title: {
        fontSize: fontSizes.xl,
        fontWeight: 'bold',
        marginBottom: 14,
        lineHeight: lineHeights.tight,
        [mediaQueries.xsMax]: {
            lineHeight: lineHeights.none,
            fontSize: fontSizes.lg
        }
    },
    allSavedWrapper: {
        marginTop: space[5],
        marginBottom: space[4],
        [mediaQueries.xsMax]: {
            marginTop: space[4],
            paddingRight: space[4],
            paddingLeft: space[4]
        }
    },
    allItems: {
        fontSize: fontSizes.md,
        fontWeight: 'bold',
        marginBottom: 16,
        lineHeight: lineHeights.tight,
        [mediaQueries.xsMax]: {
            lineHeight: lineHeights.none,
            fontSize: fontSizes.base
        }
    },
    sortingWrapper: {
        marginBottom: space[4]
    },
    pillSort: {
        marginLeft: space[2],
        maxHeight: 36,
        fontSize: fontSizes.base,
        [mediaQueries.xsMax]: {
            fontSize: fontSizes.sm
        }
    },
    image: {
        display: 'block',
        marginLeft: 'auto',
        marginRight: 'auto',
        size: 128,
        marginTop: space[7],
        marginBottom: space[6]
    },
    titleWrapper: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
        [mediaQueries.xsMax]: {
            flexDirection: 'row',
            justifyContent: 'space-between'
        }
    },
    blueLink: {
        color: colors['blue'],
        padding: space[0],
        marginBottom: space[3],
        [mediaQueries.xsMax]: {
            lineHeight: lineHeights.relaxed,
            paddingLeft: 0
        }
    },
    showMoreProducts: {
        justifyContent: 'center',
        flexDirection: 'column',
        marginTop: space[5],
        textAlign: 'center',
        marginLeft: 'auto',
        marginRight: 'auto',
        width: 200
    },
    itemCountText: {
        display: 'block',
        color: colors['gray'],
        fontSize: fontSizes['sm'],
        marginBottom: space[5]
    },
    results: {
        marginBottom: space[1]
    }
};

Lists.propTypes = {
    myLists: PropTypes.object,
    allLovesFlatList: PropTypes.array,
    user: PropTypes.object,
    isUserAtleastRecognized: PropTypes.bool.isRequired,
    isUserReady: PropTypes.bool.isRequired,
    isEmptyState: PropTypes.bool.isRequired,
    totalLovesListItemsCount: PropTypes.number,
    totalLoadedProductsText: PropTypes.string,
    localization: PropTypes.object.isRequired,
    fetchData: PropTypes.func.isRequired,
    showSignInModal: PropTypes.func.isRequired,
    fetchAllLovedItems: PropTypes.func.isRequired
};

Lists.defaultProps = {
    myLists: Empty.Object,
    allLovesFlatList: Empty.Array,
    user: Empty.Object,
    isUserAtleastRecognized: false,
    isUserReady: false,
    isEmptyState: true,
    totalLovesListItemsCount: 0,
    totalLoadedProductsText: '',
    localization: Empty.Object,
    fetchData: Empty.Function,
    showSignInModal: Empty.Function,
    fetchAllLovedItems: Empty.Function
};

export default wrapComponent(decoratorUtils.ensureUserIsAtLeastRecognized(Lists), 'Lists', true);
