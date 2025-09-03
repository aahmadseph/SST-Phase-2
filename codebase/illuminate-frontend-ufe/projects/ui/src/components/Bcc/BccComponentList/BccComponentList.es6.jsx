/* eslint-disable complexity */
/* eslint-disable class-methods-use-this */
import React from 'react';
import BaseClass from 'components/BaseClass';
import { wrapComponent } from 'utils/framework';
import { Box } from 'components/ui';
import BCCUtils from 'utils/BCC';
import SkeletonBanner from 'components/Banner/SkeletonBanner/SkeletonBanner';
import BccStyleWrapper from 'components/Bcc/BccStyleWrapper/BccStyleWrapper';
import BccImage from 'components/Bcc/BccImage/BccImage';
import BccPromotion from 'components/Bcc/BccPromotion/BccPromotion';
import BccGrid from 'components/Bcc/BccGrid/BccGrid';
import BccSkuGrid from 'components/Bcc/BccSkuGrid/BccSkuGrid';
import BccCarousel from 'components/Bcc/BccCarousel/BccCarousel';
import BccLink from 'components/Bcc/BccLink/BccLink';
import BccLinkGroup from 'components/Bcc/BccLinkGroup/BccLinkGroup';
import BccMarkdown from 'components/Bcc/BccMarkdown/BccMarkdown';
import BccSlideshow from 'components/Bcc/BccSlideshow/BccSlideshow';
import BccTargeter from 'components/Bcc/BccTargeter/BccTargeter';
import BccVideo from 'components/Bcc/BccVideo/BccVideo';
import BccProductFinder from 'components/Bcc/BccProductFinder/BccProductFinder';
import TestTarget from 'components/TestTarget/TestTarget';
import Html from 'components/Html/Html';
import BccPlaceHolderApp from 'components/Bcc/BccPlaceHolderApp/BccPlaceHolderApp';
import BccTabsList from 'components/Bcc/BccTabsList';
import BccTab from 'components/Bcc/BccTab/BccTab';
import BccEmailSmsOptIn from 'components/Bcc/BccEmailSmsOptIn/BccEmailSmsOptIn';

const { COMPONENT_NAMES } = BCCUtils;

class BccComponentList extends BaseClass {
    constructor(props) {
        super(props);

        this.state = {
            isLoadingTabsList: true // Initialize loading state for tabs list
        };
    }

    handleTabsListMount = () => {
        // Child component has finished mounting, update loading state
        this.setState({ isLoadingTabsList: false });
    };

    process = (comps, isContained, parentTitle, origin) => {
        /* eslint-disable-next-line complexity */
        const componentList =
            comps &&
            comps.map((bccComponent, index) => {
                let comp;
                const bccComp = Object.assign({}, bccComponent);
                bccComp.origin = origin ? origin : null;

                /*
                 * This is used to pass additional properties to components
                 * which could be used for styling based on place they are needed
                 * for example persistent banner
                 */
                if (!bccComp.enableTesting) {
                    bccComp.isBccStyleWrapperApplied = true;
                }

                if (typeof this.props.propsCallback !== 'undefined') {
                    if (COMPONENT_NAMES.TARGETER === bccComp.componentType) {
                        Object.assign(bccComp, {
                            propsCallback: this.props.propsCallback
                        });
                    } else if (typeof bccComp.propsCallback !== 'undefined') {
                        Object.assign(bccComp, bccComp.propsCallback(bccComp.componentType));
                    } else if (typeof this.props.propsCallback === 'function') {
                        Object.assign(bccComp, this.props.propsCallback(bccComp.componentType, bccComp.name));
                    }
                }

                /*eslint-disable no-case-declarations*/

                switch (bccComp.componentType) {
                    case COMPONENT_NAMES.IMAGE:
                    case COMPONENT_NAMES.PROMOTION:
                        const Type = bccComp.componentType === COMPONENT_NAMES.IMAGE ? BccImage : BccPromotion;
                        comp = (
                            <Type
                                isContained={isContained}
                                parentTitle={parentTitle}
                                contextualParentTitles={this.props.contextualParentTitles}
                                {...bccComp}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.REWARDS_CAROUSEL:
                    case COMPONENT_NAMES.CAROUSEL:
                        const carouselItems = bccComp.skus || bccComp.biRewards || [];
                        const isEnableCircle = bccComp.isEnableCircle ? bccComp.isEnableCircle : bccComp.enableCircle ? bccComp.enableCircle : false;
                        comp = (
                            <BccCarousel
                                {...bccComp}
                                totalItems={carouselItems.length}
                                isEnableCircle={isEnableCircle}
                                skuImageSize={bccComp.carouselImageSize || bccComp.skuImageSize}
                                carouselItems={carouselItems}
                                isContained={isContained}
                                useAddToBasket={bccComp.useAddToBasket || bccComp.isUseAddToBasket}
                                lazyLoad='img'
                                showItemsFromProps={this.props.showItemsFromProps}
                                displayCount={Sephora.isMobile() ? 2 : bccComp.displayCount > 0 ? bccComp.displayCount : 4}
                                analyticsContext={this.props.analyticsContext}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.GRID:
                        /* TODO: API Team named title property like imageTitle,
                    this is due to change in 17.1*/
                        comp = bccComp.components && (
                            <BccGrid
                                cols={Sephora.isMobile() ? bccComp.mWebColumns : bccComp.desktopColumns}
                                parentTitle={parentTitle}
                                isContained={isContained}
                                lazyLoad='img'
                                {...bccComp}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.SKU_GRID:
                        comp = (
                            <BccSkuGrid
                                lazyLoad='img'
                                analyticsContext={this.props.analyticsContext}
                                {...bccComp}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.LINK_GROUP:
                        comp = bccComp.links && (
                            <BccLinkGroup
                                isContained={isContained}
                                {...bccComp}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.PRODUCT_FINDER:
                        comp = (
                            <BccProductFinder
                                isContained={isContained}
                                {...bccComp}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.LINK:
                        const linkAttrs = {
                            url: bccComp.targetScreen.targetUrl,
                            target: bccComp.targetScreen.targetWindow,
                            title: bccComp.altText,
                            text: bccComp.displayTitle,
                            icid2: bccComp.icid2,
                            modalTemplate: bccComp.modalComponentTemplate,
                            componentName: bccComp.componentName
                        };
                        comp = (
                            <BccLink
                                {...bccComp}
                                {...linkAttrs}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.MARKDOWN:
                        comp = (
                            <BccMarkdown
                                {...bccComp}
                                callback={this.props.markdownCallback}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.SLIDESHOW:
                        comp = bccComp.images && (
                            <BccSlideshow
                                isContained={isContained}
                                lazyLoad='img'
                                {...bccComp}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.VIDEO:
                        comp = (
                            <BccVideo
                                isContained={isContained}
                                videoId={bccComp.filePath}
                                {...bccComp}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.TARGETER:
                        comp = (
                            <BccTargeter
                                isContained={isContained}
                                {...bccComp}
                            />
                        );

                        break;
                    case COMPONENT_NAMES.HTML:
                        comp = <Html content={bccComp.text} />;

                        break;
                    case COMPONENT_NAMES.PLACEHOLDERAPP:
                        comp = <BccPlaceHolderApp {...bccComp} />;

                        break;
                    case COMPONENT_NAMES.TABSLIST:
                        /* This height is the height of this component visible above the fold  */
                        const tabsListSkeletonHeight = 650;
                        comp = (
                            <>
                                {this.state.isLoadingTabsList && <SkeletonBanner height={tabsListSkeletonHeight} />}
                                <BccTabsList
                                    isContained={isContained}
                                    {...bccComp}
                                    onChildLoad={this.handleTabsListMount}
                                />
                            </>
                        );

                        break;
                    case COMPONENT_NAMES.TAB:
                        comp = <BccTab {...bccComp} />;

                        break;
                    case COMPONENT_NAMES.EMAILSMSOPTIN:
                        comp = <BccEmailSmsOptIn {...bccComp} />;

                        break;
                    default:
                        break;
                }

                if (bccComp.enableTesting) {
                    comp = comp && (
                        <TestTarget
                            key={index.toString()}
                            testComponent={comp.type.class}
                            testName={bccComp.testName || bccComp.name}
                            testEnabled
                            isBcc
                            {...comp.props}
                        />
                    );
                } else {
                    // isBccStyleWrapperApplied flag indicates if this wrapper is applied
                    comp = comp && (
                        <BccStyleWrapper
                            key={index.toString()}
                            customStyle={bccComp.styleList}
                        >
                            {comp}
                        </BccStyleWrapper>
                    );
                }

                return comp;
            });

        return componentList;
    };

    render() {
        const {
            items,
            isContained = true,
            parentTitle,
            propsCallback,
            enablePageRenderTracking = false,
            disableLazyLoadCount = null,
            origin,
            ...props
        } = this.props;

        const compItems = (items || []).slice();
        const contentLength = compItems.length;

        if (disableLazyLoadCount) {
            const max = disableLazyLoadCount <= contentLength ? disableLazyLoadCount : contentLength;

            for (let i = 0; i < max; i++) {
                compItems[i] = Object.assign({}, compItems[i]);
                compItems[i].disableLazyLoad = true;
            }
        }

        if (enablePageRenderTracking) {
            const max = contentLength > 1 ? 2 : contentLength;

            for (let i = 0; i < max; i += 1) {
                compItems[i].enablePageRenderTracking = true;
            }
        }

        const componentList = this.process(compItems, isContained, parentTitle, origin);

        return (
            <Box
                is='div'
                baseCss={{ '&:empty': { display: 'none' } }}
                {...props}
            >
                {componentList}
            </Box>
        );
    }
}

export default wrapComponent(BccComponentList, 'BccComponentList');
