import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import {
    Text, Box, Divider, Grid
} from 'components/ui';
import ProductTableItem from 'components/ProductPage/ProductTable/ProductTableItem/ProductTableItem';
import { space, site } from 'style/config';

class ProductTable extends BaseClass {
    constructor(props) {
        super(props);
        this.state = {
            recommendedSkus: [],
            recommendedTitle: ''
        };
        this.scrollRef = React.createRef();
    }

    componentDidMount() {
        if (this.props.podId) {
            this.props.skuList && this.setConstructorComparisonGridItems();
        }
    }

    componentDidUpdate(prevProps) {
        if (this.props.podId) {
            if (this.props.skuList && prevProps.skuList !== this.props.skuList) {
                this.setConstructorComparisonGridItems();
            }
        }
    }

    getComparisonSku = (currentSku, productDetails, comparisonSkuHighlights) => {
        return {
            skuId: currentSku?.skuId,
            skuImages: currentSku?.skuImages,
            size: currentSku?.size,
            brandName: productDetails?.brand?.displayName,
            productName: productDetails?.displayName,
            highlights: comparisonSkuHighlights,
            listPrice: currentSku?.listPrice,
            salePrice: currentSku?.salePrice,
            valuePrice: currentSku?.valuePrice,
            productId: productDetails?.productId,
            targetUrl: currentSku?.targetUrl,
            starRatings: productDetails?.rating,
            productReviewCount: productDetails?.reviews
        };
    };

    setConstructorComparisonGridItems = () => {
        const { currentProduct, title, skuList } = this.props;
        const { currentSku, productDetails } = currentProduct;
        const comparisonSkuHighlights = currentSku?.highlights?.map(highlight => highlight.name);
        const comparisonSku = this.getComparisonSku(currentSku, productDetails, comparisonSkuHighlights);
        const skus = [null, comparisonSku, ...skuList];

        this.setState(
            {
                recommendedSkus: skus,
                recommendedTitle: title
            },
            () => {
                if (this.scrollRef.current) {
                    this.scrollRef.current.scrollLeft = 0;
                }
            }
        );
    };

    render() {
        const { recommendedSkus, recommendedTitle } = this.state;
        const { podId, resultId, totalResults, isCarousel } = this.props;

        return recommendedSkus?.length ? (
            <Box
                lineHeight='tight'
                marginBottom={[6, 7]}
            >
                <Divider />
                <Text
                    is='h2'
                    marginY='1em'
                    fontSize={['md', 'lg']}
                    fontWeight='bold'
                    children={recommendedTitle}
                />
                <Grid
                    ref={this.scrollRef}
                    columns={`${space.container}px 98px repeat(6, ${(site.containerMax - 98) / 6}px)`}
                    fontSize={['sm', 'base']}
                    gap={null}
                    marginX='-container'
                    paddingRight='container'
                    css={{
                        overflow: 'auto',
                        scrollBehavior: 'smooth',
                        scrollbarWidth: 'none',
                        overscrollBehaviorX: 'none',
                        scrollSnapType: 'x mandatory',
                        '&::-webkit-scrollbar': { display: 'none' },
                        '& > *': {
                            scrollSnapAlign: 'start'
                        }
                    }}
                    data-cnstrc-recommendations
                    data-cnstrc-recommendations-pod-id={podId}
                    data-cnstrc-result-id={resultId}
                    data-cnstrc-num-results={totalResults}
                >
                    <div />
                    {recommendedSkus.map((sku, index) => (
                        <ProductTableItem
                            key={`carouselBasketItem_${index}_${sku?.skuId || 'label'}`}
                            sku={sku}
                            index={index}
                            podId={this.props.podId}
                            isCarousel={isCarousel}
                        />
                    ))}
                </Grid>
            </Box>
        ) : null;
    }
}

export default wrapComponent(ProductTable, 'ProductTable', true);
