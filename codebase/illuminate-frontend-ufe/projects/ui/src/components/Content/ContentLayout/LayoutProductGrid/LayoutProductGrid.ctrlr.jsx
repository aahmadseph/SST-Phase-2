/* eslint-disable class-methods-use-this */
/* eslint-disable camelcase */
import React from 'react';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import {
    Box, Button, Link, Text, Grid, Container
} from 'components/ui';
import ProductTile from 'components/Catalog/ProductGrid/ProductTile';
import Chiclet from 'components/Chiclet';
import Action from 'components/Content/Action';
import getStyles from 'components/Catalog/ProductGrid/styles';
import mediaUtils from 'utils/Media';
import { breakpoints, space, mediaQueries } from 'style/config';
import MarketingTile from 'components/Catalog/ProductGrid/MarketingTile';
import Breadcrumb from 'components/Content/Breadcrumb';
import contentStoreLayoutProductGridBindings from 'analytics/bindingMethods/pages/contentStore/contentStoreLayoutProductGridBindings';

import { RESULTS_COUNT, ALL, CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import { ML_VS_CONSTRUCTOR } from 'constants/TestTarget';

const NUMBER_OF_TILES = 20;
const ActionLink = Action(Link);
const ActionChiclet = Action(Chiclet);
const { Media } = mediaUtils;
const { setPageLoadAnalytics, getNavigationInfo, getRootContainerName } = contentStoreLayoutProductGridBindings;
class LayoutProductGrid extends BaseClass {
    constructor(props) {
        super(props);
        this.navRef = React.createRef();
        this.state = {
            pageNum: 1
        };
    }

    loadMoreProducts = () => {
        const nextPage = this.state.pageNum + 1;

        this.setState({
            pageNum: nextPage
        });
    };

    updateConstructorRecommendations = () => {
        const { content, podId, isNewContentPage } = this.props;
        const isCollection = !!isNewContentPage;
        this.setState({ pageNum: 1 }, () => {
            const params = {
                ...(isNewContentPage ? { resultsPerPage: RESULTS_COUNT.NEW_CONTENT_PAGE } : { numResults: RESULTS_COUNT.BESTSELLERS }),
                ...(podId !== CONSTRUCTOR_PODS.NEW_CONTENT_PAGE_JUST_DROPPED && {
                    filters: {
                        group_id: content.certonaCategoryId || ALL
                    }
                })
            };
            this.props.updateRequestData({ params, podId, isCollection });
        });
    };

    componentDidMount() {
        if (this.props.layoutExperience === ML_VS_CONSTRUCTOR.ML && this.props.user.isInitialized) {
            this.props.getBestSellersRecs({
                userId: this.props.user.userId,
                catId: this.props.content.certonaCategoryId
            });
        }

        if (this.props.layoutExperience === ML_VS_CONSTRUCTOR.CONSTRUCTOR) {
            this.updateConstructorRecommendations();
        }

        setPageLoadAnalytics(this.props.breadcrumbs);

        const activeIndex = this.props.navigation?.items.findIndex(link => link.action?.isCurrent);

        if (activeIndex !== -1 && window.matchMedia(breakpoints.smMax).matches) {
            const activeLink = this.navRef.current?.children[activeIndex];

            if (activeLink?.offsetWidth + activeLink?.offsetLeft > window.innerWidth) {
                activeLink.scrollIntoView({ inline: 'center' });
            }
        }
    }

    componentDidUpdate(prevProps) {
        if (
            this.props.layoutExperience === ML_VS_CONSTRUCTOR.ML &&
            (prevProps.user.isInitialized !== this.props.user.isInitialized || prevProps.layoutExperience !== this.props.layoutExperience)
        ) {
            this.props.getBestSellersRecs({
                userId: this.props.user.userId,
                catId: this.props.content.certonaCategoryId
            });
        }

        if (this.props.layoutExperience === ML_VS_CONSTRUCTOR.CONSTRUCTOR && this.props?.podId !== prevProps?.podId) {
            this.updateConstructorRecommendations();
        }

        // For page updates initiated from Left Nav / Breadcrumbs
        if (prevProps.content.sid !== this.props.content.sid) {
            if (this.props.layoutExperience === ML_VS_CONSTRUCTOR.ML) {
                this.props.user.isInitialized &&
                    this.setState({ pageNum: 1 }, () => {
                        this.props.getBestSellersRecs({
                            userId: this.props.user.userId,
                            catId: this.props.content.certonaCategoryId
                        });
                    });
            } else {
                this.setState({ pageNum: 1 });
            }

            setPageLoadAnalytics(this.props.breadcrumbs);
        }
    }

    render() {
        const {
            localization, content, seo, navigation, breadcrumbs, isLoading = true, podId, totalResults, resultId
        } = this.props;
        const { marketingTiles, marketingTilePositions, certonaCategoryId } = content;
        const gridLength = NUMBER_OF_TILES * this.state.pageNum;
        const skus = this.props.recs?.slice(0, gridLength);
        const showLoadMoreproducts = this.props.recs?.length > gridLength;
        const similarProducts = Sephora.isDesktop() && !!certonaCategoryId;
        const tileStyles = getStyles();

        return (
            <Container>
                {breadcrumbs && (
                    <Breadcrumb
                        breadcrumbs={breadcrumbs}
                        localization={localization?.breadcrumb}
                    />
                )}
                <Grid
                    gap={[5, null, 7]}
                    columns={[null, null, '208px 1fr']}
                    marginTop={!breadcrumbs && [4, 6]}
                >
                    <Box lineHeight='tight'>
                        {seo?.header1 && (
                            <Text
                                is='p'
                                fontSize={['lg', 'xl']}
                                marginBottom={[3, 5]}
                                fontWeight='bold'
                            >
                                {seo.header1}
                            </Text>
                        )}
                        {navigation && (
                            <ul
                                css={styles.nav}
                                ref={this.navRef}
                            >
                                {(navigation.items || []).map(link => (
                                    <li key={`navLink_${link.label}`}>
                                        <Media lessThan='md'>
                                            <ActionChiclet
                                                variant='shadow'
                                                sid={link.sid}
                                                isActive={link.action?.isCurrent}
                                                action={link.action}
                                                children={link.label}
                                                analyticsNextPageData={getNavigationInfo(breadcrumbs, link.label)}
                                            />
                                        </Media>
                                        <Media greaterThan='sm'>
                                            <ActionLink
                                                sid={link.sid}
                                                display='block'
                                                paddingY='.5em'
                                                fontWeight={link.action?.isCurrent && 'bold'}
                                                action={link.action}
                                                children={link.label}
                                                analyticsNextPageData={getNavigationInfo(breadcrumbs, link.label)}
                                            />
                                        </Media>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </Box>
                    <main
                        css={tileStyles.root}
                        {...(podId && {
                            'data-cnstrc-recommendations': true,
                            'data-cnstrc-recommendations-pod-id': podId,
                            'data-cnstrc-result-id': resultId,
                            'data-cnstrc-num-results': totalResults
                        })}
                    >
                        {(marketingTiles || []).map((marketingTile, tileIndex) => {
                            const order = marketingTilePositions[tileIndex] - 1;

                            return (
                                <div
                                    key={marketingTile.sid || marketingTile.imageSource}
                                    css={tileStyles.item}
                                    style={{ alignSelf: 'flex-start', order }}
                                >
                                    <MarketingTile content={marketingTile} />
                                </div>
                            );
                        })}
                        {isLoading
                            ? [...Array(NUMBER_OF_TILES).keys()].map((item, index) => (
                                <div
                                    key={`productTileSkeleton_${index}`}
                                    css={tileStyles.item}
                                    style={{ order: index }}
                                >
                                    <ProductTile isSkeleton={true} />
                                </div>
                            ))
                            : (skus || []).map((sku, index) => (
                                <div
                                    key={sku.skuId}
                                    css={tileStyles.item}
                                    style={{ order: index }}
                                >
                                    <ProductTile
                                        product={sku}
                                        index={index}
                                        rootContainerName={getRootContainerName(breadcrumbs)}
                                        similarProducts={similarProducts}
                                    />
                                </div>
                            ))}
                        {!isLoading && (
                            <div css={[tileStyles.item, tileStyles.showMore]}>
                                {skus?.length ? (
                                    <Text
                                        is='p'
                                        color='gray'
                                        lineHeight='tight'
                                        fontSize={['sm', 'base']}
                                        marginBottom={2}
                                        children={`${localization.viewing} 1-${skus.length} ${localization.results}`}
                                    />
                                ) : null}
                                {showLoadMoreproducts ? (
                                    <Button
                                        variant='secondary'
                                        css={tileStyles.showMoreButton}
                                        children={localization.showMore}
                                        onClick={this.loadMoreProducts}
                                    />
                                ) : null}
                            </div>
                        )}
                    </main>
                </Grid>
            </Container>
        );
    }
}

const styles = {
    nav: {
        [mediaQueries.smMax]: {
            margin: `-${space[2]}px -${space.container}px`,
            padding: `${space[2]}px ${space.container}px`,
            fontSize: 0,
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            scrollbarWidth: 'none',
            '&::-webkit-scrollbar': { display: 'none' },
            li: {
                display: 'inline-block',
                '+ li': {
                    marginLeft: space[2]
                }
            }
        },
        [mediaQueries.md]: {
            marginTop: '-.5em'
        }
    }
};

LayoutProductGrid.propTypes = {
    user: PropTypes.object.isRequired,
    localization: PropTypes.object.isRequired,
    layoutExperience: PropTypes.string,
    recs: PropTypes.array,
    isLoading: PropTypes.bool.isRequired,
    bestSellersMLFailed: PropTypes.bool.isRequired,
    content: PropTypes.object.isRequired,
    navigation: PropTypes.object,
    seo: PropTypes.object,
    breadcrumbs: PropTypes.array,
    totalResults: PropTypes.number,
    resultId: PropTypes.string
};

LayoutProductGrid.defaultProps = {
    navigation: null,
    seo: null,
    breadcrumbs: null,
    totalResults: null,
    resultId: null
};

export default wrapComponent(LayoutProductGrid, 'LayoutProductGrid', true);
