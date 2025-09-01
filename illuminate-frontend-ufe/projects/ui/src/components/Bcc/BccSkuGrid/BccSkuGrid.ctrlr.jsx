import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import { Box, Image } from 'components/ui';
import BccBase from 'components/Bcc/BccBase/BccBase';
import ProductItem from 'components/Product/ProductItem';
import Markdown from 'components/Markdown/Markdown';
import {
    fonts, fontSizes, lineHeights, space
} from 'style/config';
import BCCUtils from 'utils/BCC';
import anaConsts from 'analytics/constants';

const { IMAGE_SIZES, COPY_TEXT_PLACEMENT } = BCCUtils;

const GUTTER_PADDING = space[3];

class BccSkuGrid extends BaseClass {
    state = {
        skuList: this.props.skus || null
    };

    pageNum = 2;

    componentDidMount() {
        this.setState({ skuList: (this.props.skus || []).slice() });
    }

    componentWillUnmount() {
        // Only unsubscribe if the grid is within a
        // modal because it wont have pagination
        if (this.props.isGridInModal && this.subscriptions && this.subscriptions.length) {
            this.subscriptions[0]();
        }
    }

    renderTitle = () => {
        const {
            title,
            mobileWebTitleText,
            subHead,
            mobileWebSubHead,
            alignment = 'center',
            mobileWebAlignment = 'left',
            imagePath,
            titleImageAltText,
            disableLazyLoad = false
        } = this.props;

        const isMobile = Sephora.isMobile();
        const titleText = isMobile ? mobileWebTitleText : title;
        const subHeadText = isMobile ? mobileWebSubHead : subHead;
        const titleAlignment = (isMobile ? mobileWebAlignment : alignment).toLowerCase();
        const gridTitle = titleText;
        const useSmallTitle = isMobile || this.props.isGridInModal;

        return (
            (imagePath || gridTitle || subHeadText) && (
                <Box marginBottom={useSmallTitle ? 5 : 6}>
                    {imagePath ? (
                        <Image
                            src={imagePath}
                            alt={titleImageAltText}
                            disableLazyLoad={disableLazyLoad}
                        />
                    ) : (
                        gridTitle && (
                            <Box textAlign={titleAlignment}>
                                {gridTitle && (
                                    <Box
                                        lineHeight='none'
                                        children={gridTitle}
                                        data-at={Sephora.debug.dataAt('skuGrid_content_page')}
                                        css={{
                                            fontSize: useSmallTitle ? fontSizes.xl : fontSizes['2xl'],
                                            fontFamily: fonts.serif
                                        }}
                                    />
                                )}
                                {subHeadText && (
                                    <Box
                                        marginTop={(title || imagePath) && 2}
                                        fontSize={useSmallTitle ? 'base' : 'md'}
                                        children={subHeadText}
                                    />
                                )}
                            </Box>
                        )
                    )}
                </Box>
            )
        );
    };

    renderGrid = (skuList, config) => {
        const skuArray = this.setUpArray(skuList, config);
        const rowsArray = [];
        const skuCount = skuArray.length;
        let hasReachedLimit = false;
        const rowCount = config.rows;

        for (let i = 0; i < rowCount && !hasReachedLimit; i++) {
            const rowItems = [];

            for (let j = 0; j < config.cols && !hasReachedLimit; j++) {
                const index = i * config.cols + j;

                if (index < skuCount) {
                    const skuObject = skuArray[index];
                    rowItems.push(this.renderSku(skuObject, config));
                } else {
                    hasReachedLimit = true;
                }
            }

            if (rowItems.length) {
                rowsArray.push(
                    <div
                        key={`row-${i}`}
                        css={styles.row}
                        data-lload={'false'}
                    >
                        {rowItems.slice()}
                    </div>
                );
            }
        }

        return rowsArray;
    };

    setUpArray = (skuList, options) => {
        return skuList.map(skuObject => {
            const sku = skuObject.sku;

            return {
                copyText: skuObject.copyText,
                sku: {
                    ...sku,
                    actionFlags: {
                        backInStockReminderStatus: 'inactive'
                    },
                    isWithBackInStockTreatment: options.showSignUpForEmail
                }
            };
        });
    };

    renderSku = (skuObject, config) => {
        const isDesktop = Sephora.isDesktop();
        const { name, analyticsContext, firstParentCategoryId, closeParentModal } = this.props;
        const copy =
            skuObject.copyText && config.copyTextPlacement && config.copyTextPlacement !== COPY_TEXT_PLACEMENT.HIDE ? (
                <Markdown content={skuObject.copyText} />
            ) : null;

        const hasTopCopy = copy && config.copyTextPlacement === COPY_TEXT_PLACEMENT.TOP;
        const hasBottomCopy = copy && config.copyTextPlacement === COPY_TEXT_PLACEMENT.BOTTOM;

        return (
            <div
                css={[hasTopCopy || hasBottomCopy ? (isDesktop ? styles.itemColFS : styles.itemColMW) : isDesktop ? styles.itemFS : styles.itemMW]}
                style={
                    isDesktop && config.cols
                        ? {
                            width: (1 / config.cols) * 100 + '%'
                        }
                        : null
                }
                key={skuObject.sku.productId}
            >
                {hasTopCopy && <div css={styles.copyTop}>{copy}</div>}
                <ProductItem
                    disableLazyLoad={true}
                    showBadges={config.showBadges}
                    showMarketingFlags={config.showMarketingFlags}
                    showReviews={config.showReviews}
                    showLoves={config.showLoves}
                    showPrice={config.showPrice}
                    formatValuePrice={config.formatValuePrice}
                    imageSize={IMAGE_SIZES[config.skuImageSize]}
                    componentClass='ProductItem'
                    analyticsContext={analyticsContext}
                    useAddToBasket={config.useAddToBasket}
                    isAddButton={config.isAddButton}
                    origin={this.props.origin}
                    rootContainerName={name || anaConsts.COMPONENT_TITLE.SKUGRID}
                    firstParentCategoryId={firstParentCategoryId}
                    closeParentModal={closeParentModal}
                    productStringContainerName={anaConsts.COMPONENT_TITLE.SKUGRID}
                    {...skuObject.sku}
                />
                {hasBottomCopy && <div css={styles.copyBot}>{copy}</div>}
            </div>
        );
    };

    render() {
        const {
            cols,
            displayCopy,
            ignoreOOSTreatment,
            isShowFlags,
            isShowStarRatings,
            lazyLoad,
            rows,
            showLoves,
            showSignUpForEmail,
            skuImageSize,
            useAddToBasket,
            isAddButton
        } = this.props;

        const config = {
            cols,
            copyTextPlacement: displayCopy,
            formatValuePrice: false,
            ignoreOOSTreatment,
            rows,
            showBadges: true,
            showLoves,
            showMarketingFlags: isShowFlags,
            showPrice: true,
            showReviews: isShowStarRatings,
            showSignUpForEmail,
            skuImageSize,
            useAddToBasket,
            isAddButton
        };

        const skuList = this.state.skuList;

        return (
            skuList && (
                <BccBase
                    {...this.props}
                    data-lload={lazyLoad}
                >
                    {this.renderTitle(this.props)}
                    {this.renderGrid(skuList, config)}
                </BccBase>
            )
        );
    }
}

const itemStyle = {
    display: 'flex',
    paddingLeft: GUTTER_PADDING,
    paddingRight: GUTTER_PADDING,
    textAlign: 'center',
    lineHeight: lineHeights.tight
};

const itemStyleMW = {
    width: '50%',
    marginTop: space[4],
    marginBottom: space[4]
};

const itemStyleFS = {
    marginTop: space[5],
    marginBottom: space[5]
};

const styles = {
    row: {
        display: 'flex',
        flexFlow: 'row wrap',
        marginLeft: -GUTTER_PADDING,
        marginRight: -GUTTER_PADDING
    },
    itemMW: [itemStyle, itemStyleMW],
    itemFS: [itemStyle, itemStyleFS],
    itemColMW: [
        itemStyle,
        itemStyleMW,
        {
            flexDirection: 'column'
        }
    ],
    itemColFS: [
        itemStyle,
        itemStyleFS,
        {
            flexDirection: 'column'
        }
    ],
    copyTop: {
        paddingBottom: space[4],
        marginBottom: 'auto'
    },
    copyBot: {
        paddingTop: space[4],
        marginTop: 'auto'
    }
};

export default wrapComponent(BccSkuGrid, 'BccSkuGrid', true);
