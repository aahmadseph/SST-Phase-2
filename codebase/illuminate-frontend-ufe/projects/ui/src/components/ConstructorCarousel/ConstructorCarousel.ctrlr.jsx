/* eslint-disable class-methods-use-this */
import React from 'react';
import ProductList from 'components/Content/ProductList';
import ProductTable from 'components/ProductPage/ProductTable';
import BccCarousel from 'components/Bcc/BccCarousel/BccCarousel';
import { wrapComponent } from 'utils/framework';
import BCCUtils from 'utils/BCC';
import PropTypes from 'prop-types';
import BaseClass from 'components/BaseClass';
import ProductItem from 'components/Product/ProductItem';
import { CONSTRUCTOR_PODS } from 'constants/constructorConstants';
import { Grid, Text } from 'components/ui';
import { fontSizes, fonts, space } from 'style/config';

const { COMPONENT_NAMES, IMAGE_SIZES } = BCCUtils;

class ConstructorCarousel extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            constructorRecommendations: [],
            constructorTitle: this.props.title || '',
            showSkeleton: true,
            resultId: null,
            totalResults: null
        };
    }
    setPropertiesFromConstructor = constructorRecommendations => {
        const { title, skuList, onConstructorFailed = () => {} } = this.props;

        if (constructorRecommendations) {
            const currentRecs = constructorRecommendations[this.props.podId];

            if (currentRecs?.isError || currentRecs?.isEmpty) {
                this.setState({
                    constructorRecommendations: skuList,
                    constructorTitle: title
                });
                onConstructorFailed();
            } else {
                this.setState({ ...currentRecs });
            }

            if (currentRecs !== undefined) {
                this.setState({ showSkeleton: false });
            }
        }
    };

    getConvenienceHubParams(storeId) {
        return storeId
            ? {
                filters: {
                    availability: `store_${storeId}`
                }
            }
            : {};
    }

    componentDidMount() {
        const {
            params = {}, constructorRecs, podId, isCollection = false, preferredStoreId
        } = this.props;
        const isConvenienceHub = podId === CONSTRUCTOR_PODS.RFY_CONVENIENCE_HUB;

        if (isConvenienceHub && !preferredStoreId) {
            return;
        }

        this.props.updateRequestData({
            params: isConvenienceHub ? this.getConvenienceHubParams(preferredStoreId) : params,
            podId,
            isCollection
        });

        if (constructorRecs) {
            this.setPropertiesFromConstructor(constructorRecs);
        }
    }

    componentDidUpdate(prevProps) {
        const {
            params = {}, constructorRecs, podId, isCollection = false, preferredStoreId
        } = this.props;
        const isConvenienceHub = podId === CONSTRUCTOR_PODS.RFY_CONVENIENCE_HUB;

        if (isConvenienceHub && !preferredStoreId) {
            return;
        }

        if (
            (params && prevProps?.params && JSON.stringify(params) !== JSON.stringify(prevProps.params)) ||
            podId !== prevProps.podId ||
            (isConvenienceHub && prevProps.preferredStoreId !== preferredStoreId)
        ) {
            this.props.updateRequestData({
                params: isConvenienceHub ? this.getConvenienceHubParams(preferredStoreId) : params,
                podId,
                isCollection
            });
        }

        if (constructorRecs && prevProps.constructorRecs[podId] !== constructorRecs[podId]) {
            this.setPropertiesFromConstructor(constructorRecs);
        }
    }

    renderCarousel() {
        const {
            constructorRecommendations, constructorTitle, showSkeleton, resultId, totalResults
        } = this.state;
        const {
            currentProduct,
            showTitle,
            isSmallView,
            podId,
            isCAMobile = false,
            closeParentModal,
            customStyles,
            showBasketGreyBackground,
            customTitle,
            scrollPadding,
            ...restProps
        } = this.props;

        switch (podId) {
            case CONSTRUCTOR_PODS.SIMILAR_PRODUCTS:
                return isCAMobile ? (
                    <ProductList
                        {...restProps}
                        skuList={constructorRecommendations}
                        title={constructorTitle}
                        grouping={this.props.grouping}
                        showSkeleton={showSkeleton}
                        podId={podId}
                        customStyles={customStyles}
                        resultId={resultId}
                        totalResults={totalResults}
                        isCarousel={true}
                    />
                ) : (
                    <ProductTable
                        skuList={constructorRecommendations}
                        isSmallView={isSmallView}
                        currentProduct={currentProduct}
                        showTitle={showTitle}
                        title={constructorTitle}
                        podId={podId}
                        resultId={resultId}
                        totalResults={totalResults}
                        isCarousel={true}
                    />
                );
            case CONSTRUCTOR_PODS.ATB:
            case CONSTRUCTOR_PODS.ORDER_CONFIRMATION:
            case CONSTRUCTOR_PODS.COMMUNITY_PROFILE:
                return (
                    <BccCarousel
                        {...restProps}
                        showArrows={true}
                        showTouts={Sephora.isMobile()}
                        title={constructorTitle}
                        mobileWebTitleText={constructorTitle}
                        carouselItems={constructorRecommendations}
                        totalItems={constructorRecommendations.length}
                        componentType={COMPONENT_NAMES.CAROUSEL}
                        podId={podId}
                        resultId={resultId}
                        totalResults={totalResults}
                        isCarousel={true}
                    />
                );
            case CONSTRUCTOR_PODS.PURCHASE_HISTORY:
            case CONSTRUCTOR_PODS.SIMILAR_PRODUCTS_CONTENT_PAGE:
            case CONSTRUCTOR_PODS.CLEAN_HIGHLIGHT:
                return (
                    <React.Fragment>
                        <Text
                            is='h3'
                            lineHeight='none'
                            css={
                                podId === CONSTRUCTOR_PODS.CLEAN_HIGHLIGHT
                                    ? { fontSize: fontSizes.lg, textAlign: 'left', fontWeight: 'var(--font-weight-bold)', marginBottom: space[4] }
                                    : {
                                        fontSize: fontSizes.xl,
                                        textAlign: 'center',
                                        marginTop: space[3],
                                        fontFamily: fonts.serif,
                                        marginBottom: space[5]
                                    }
                            }
                            children={constructorTitle}
                        />
                        <Grid
                            gap={5}
                            columns={[2, 5]}
                            data-cnstrc-recommendations
                            data-cnstrc-recommendations-pod-id={podId}
                            data-cnstrc-result-id={resultId}
                            data-cnstrc-num-results={totalResults}
                        >
                            {constructorRecommendations.map((item, index) => (
                                <ProductItem
                                    podId={podId}
                                    formatValuePrice={true}
                                    position={index}
                                    key={item.skuId}
                                    imageSize={podId === CONSTRUCTOR_PODS.CLEAN_HIGHLIGHT ? 132 : IMAGE_SIZES[135]}
                                    showQuickLook={true}
                                    showPrice={true}
                                    showReviews={true}
                                    showBadges={true}
                                    showMarketingFlags={true}
                                    useAddToBasket={podId === CONSTRUCTOR_PODS.CLEAN_HIGHLIGHT}
                                    isAddButton={podId === CONSTRUCTOR_PODS.CLEAN_HIGHLIGHT}
                                    closeParentModal={closeParentModal}
                                    isCleanAtSephora={podId === CONSTRUCTOR_PODS.CLEAN_HIGHLIGHT}
                                    {...item}
                                />
                            ))}
                        </Grid>
                    </React.Fragment>
                );
            default:
                return (
                    <ProductList
                        {...restProps}
                        skuList={constructorRecommendations}
                        title={customTitle || constructorTitle}
                        grouping={this.props.grouping}
                        showSkeleton={showSkeleton}
                        podId={podId}
                        customStyles={customStyles}
                        showBasketGreyBackground={showBasketGreyBackground}
                        resultId={resultId}
                        totalResults={totalResults}
                        scrollPadding={scrollPadding}
                    />
                );
        }
    }

    render() {
        const { constructorRecommendations, showSkeleton } = this.state;

        return showSkeleton || constructorRecommendations?.length > 0 ? this.renderCarousel() : null;
    }
}

ConstructorCarousel.propTypes = {
    constructorRecommendations: PropTypes.array,
    constructorTitle: PropTypes.string
};

ConstructorCarousel.defaultProps = {
    constructorRecommendations: [],
    constructorTitle: ''
};

export default wrapComponent(ConstructorCarousel, 'ConstructorCarousel', true);
