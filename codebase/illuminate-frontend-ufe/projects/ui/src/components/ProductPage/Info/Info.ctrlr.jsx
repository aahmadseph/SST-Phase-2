import BaseClass from 'components/BaseClass';
import Flag from 'components/Flag/Flag';
import ProductBreadCrumbs from 'components/ProductPage/ProductBreadCrumbs/ProductBreadCrumbs';
import {
    Divider, Flex, Grid, Link, Text
} from 'components/ui';
import { DebouncedResize } from 'constants/events';
import React from 'react';
import { mediaQueries, space } from 'style/config';
import languageLocale from 'utils/LanguageLocale';
import marketingFlagsUtil from 'utils/MarketingFlags';
import skuUtils from 'utils/Sku';
import { wrapComponent } from 'utils/framework';
import rougeExclusiveUtils from 'utils/rougeExclusive';

/*
[CRMTS-1395]
   Accordingly with this commit https://gitlab.lipstack.sephoraus.com/illuminate/frontend/ufe/-/commit/fe596327363fa5d344d7fe29b86da8071d412a7c
   GitHub link: https://github.com/Sephora-US-Digital/illuminate-frontend-ufe/commit/fe596327363fa5d344d7fe29b86da8071d412a7c
   HIDE_AND_PLACEMENT was decommissioned but not fully removed from code by any developer, so I'm documenting this change here.
   import { HIDE_AND_PLACEMENT } from 'constants/TestTarget';
*/
import typography from 'style/typography';
import bccUtils from 'utils/BCC';

const { FINAL_SALE_PRODUCT_INFO_MODAL } = bccUtils.MEDIA_IDS;
const getText = text => languageLocale.getLocaleResourceFile('components/ProductPage/locales', 'RwdProductPage')(text);

class Info extends BaseClass {
    state = {
        hasOverflow: false,
        showMore: false,
        maxHeight: null
    };

    textRef = React.createRef();

    handleResize = () => {
        const preservedShowMore = this.state.showMore;

        this.setState(
            {
                showMore: false,
                maxHeight: null
            },
            () => {
                const desc = this.textRef.current;
                this.setState({
                    showMore: preservedShowMore,
                    maxHeight: desc.offsetHeight,
                    hasOverflow: desc.scrollHeight > desc.offsetHeight
                });
            }
        );
    };

    componentDidMount() {
        this.handleResize();
        window.addEventListener(DebouncedResize, this.handleResize);
    }

    componentWillUnmount() {
        window.removeEventListener(DebouncedResize, this.handleResize);
    }

    componentDidUpdate(prevProps) {
        if (prevProps.description !== this.props.description) {
            this.setState({ showMore: false });
        }
    }

    toggleOverflow = () => {
        const currentScroll = window.scrollY;
        this.setState({ showMore: !this.state.showMore }, () => {
            window.scroll(0, currentScroll);
        });
    };

    showFinalSaleBCCModal = () => {
        const finalSaleInfoModalOptions = {
            isOpen: true,
            mediaId: FINAL_SALE_PRODUCT_INFO_MODAL,
            title: getText('finalSaleModalInfoTitle'),
            titleDataAt: 'finalSaleModalInfoTitle',
            width: 0,
            dismissButtonText: getText('gotIt')
        };

        this.props.showMediaModal({
            ...finalSaleInfoModalOptions
        });
    };

    /* eslint-disable-next-line complexity */
    render() {
        const {
            currentSku,
            description,
            title,
            dataAt,
            shouldTruncate,
            product,
            productBreadcrumbsExperience,
            hideBreadcrumbs,
            isRegularProductSmallView
        } = this.props;

        const isHiddenCategory = product?.parentCategory && product?.parentCategory?.categoryId === skuUtils.HIDDEN_CATEGORY_ID;

        let productFlags;

        if (currentSku) {
            productFlags = marketingFlagsUtil.getAboutTheProductFlags(currentSku);
            const { biExclusiveLevel, isReturnable } = currentSku;

            if (biExclusiveLevel !== skuUtils.biExclusiveLevels.NONE) {
                if (
                    biExclusiveLevel === skuUtils.biExclusiveLevels.ROUGE ||
                    biExclusiveLevel === skuUtils.biExclusiveLevels.VIB ||
                    biExclusiveLevel === skuUtils.biExclusiveLevels.BI
                ) {
                    productFlags.push({
                        name: rougeExclusiveUtils.isRougeExclusiveEnabled ? getText('rougeBadge') : 'Rouge',
                        activeColor: !!rougeExclusiveUtils.isRougeExclusiveEnabled
                    });
                }

                if (biExclusiveLevel === skuUtils.biExclusiveLevels.VIB || biExclusiveLevel === skuUtils.biExclusiveLevels.BI) {
                    productFlags.push({
                        name: 'VIB',
                        activeColor: false
                    });
                }

                if (biExclusiveLevel === skuUtils.biExclusiveLevels.BI) {
                    productFlags.push({
                        name: 'Insider',
                        activeColor: false
                    });
                }
            }

            if (isReturnable === false) {
                // this is because item.sku.isReturnable we must check for a false value
                productFlags.push({
                    name: getText('finalSaleProductFlag'),
                    activeColor: true
                });
            }
        }

        const { showMore, maxHeight } = this.state;

        return (
            <>
                <Divider />
                <Text
                    is='h2'
                    lineHeight='tight'
                    marginTop='1em'
                    marginBottom={productBreadcrumbsExperience && [2, 4]}
                    // marginBottom={productBreadcrumbsExperience && productBreadcrumbsExperience === HIDE_AND_PLACEMENT.CURRENT && [2, 4]}
                    fontSize={['md', 'lg']}
                    fontWeight='bold'
                    children={title}
                    data-at={Sephora.debug.dataAt(dataAt)}
                />
                {productBreadcrumbsExperience &&
                //productBreadcrumbsExperience === HIDE_AND_PLACEMENT.CHANGE_PLACEMENT &&
                !isHiddenCategory &&
                !hideBreadcrumbs ? (
                        <ProductBreadCrumbs
                            isRegularProductSmallView={isRegularProductSmallView}
                            productBreadcrumbsExperience={productBreadcrumbsExperience}
                            parentCategory={product?.parentCategory}
                        />
                    ) : (
                        <div
                            css={{
                                height: space[4],
                                [mediaQueries.sm]: {
                                    height: space[5]
                                }
                            }}
                        />
                    )}
                <Grid
                    alignItems='flex-start'
                    columns={[1, null, '212px 1fr']}
                    marginTop={productBreadcrumbsExperience && [2, 4]}
                    // marginTop={productBreadcrumbsExperience && productBreadcrumbsExperience === HIDE_AND_PLACEMENT.CHANGE_PLACEMENT && [2, 4]}
                    gap={[5, null, 0]}
                    marginBottom={[5, 7]}
                >
                    <Grid gap={2}>
                        {currentSku && (
                            <>
                                <Text
                                    is='p'
                                    fontSize='sm'
                                    color='gray'
                                    data-at='item_sku'
                                >
                                    {getText('item')} {currentSku.skuId}
                                </Text>
                                {productFlags && productFlags.length > 0 && (
                                    <Flex
                                        flexWrap='wrap'
                                        marginRight={[null, null, 6]}
                                        marginX='-.2em'
                                        marginTop='-.6em'
                                    >
                                        {productFlags.map((flag, key) => (
                                            <Flag
                                                key={flag.name || key}
                                                backgroundColor={flag.activeColor ? 'red' : 'black'}
                                                marginTop='.6em'
                                                marginX='.2em'
                                            >
                                                {flag.name}
                                            </Flag>
                                        ))}
                                    </Flex>
                                )}
                            </>
                        )}
                    </Grid>
                    <div>
                        {currentSku?.isReturnable === false && (
                            // this is because item.sku.isReturnable we must check for a false value
                            <Flex
                                is='p'
                                flexWrap='wrap'
                                lineHeight={[null, 'relaxed']}
                                color='red'
                                columnGap={3}
                                marginBottom={5}
                            >
                                <span>{getText('finalSaleNoReturns')}</span>
                                <Link
                                    onClick={this.showFinalSaleBCCModal}
                                    color='blue'
                                    padding={1}
                                    margin={-1}
                                    children={getText('learnMore')}
                                />
                            </Flex>
                        )}
                        <Text
                            ref={this.textRef}
                            is='div'
                            lineHeight={[null, 'relaxed']}
                            maxWidth={824}
                            numberOfLines={shouldTruncate && !showMore && !maxHeight ? 7 : null}
                            maxHeight={showMore || maxHeight}
                            overflow='hidden'
                            css={{
                                whiteSpace: 'normal',
                                ...HTML_COMP_STYLE
                            }}
                            dangerouslySetInnerHTML={{
                                __html: `<div>${description}</div>`
                            }}
                        />
                        {this.state.hasOverflow && (
                            <Link
                                onClick={this.toggleOverflow}
                                color='blue'
                                padding={2}
                                marginBottom={-2}
                                marginX={-2}
                                children={getText(showMore ? 'showLess' : 'showMore')}
                            />
                        )}
                    </div>
                </Grid>
            </>
        );
    }
}

const HTML_COMP_STYLE = {
    ...typography,
    /* No top margin on first element */
    '& > div :first-child': {
        marginTop: 0
    },
    /* No bottom margin on last element */
    '& > div :last-child': {
        marginBottom: 0
    }
};

Info.prototype.shouldUpdatePropsOn = ['currentSku.skuId', 'currentSku.actionFlags', 'title', 'description'];

Info.defaultProps = {
    shouldTruncate: true
};

export default wrapComponent(Info, 'Info', true);
