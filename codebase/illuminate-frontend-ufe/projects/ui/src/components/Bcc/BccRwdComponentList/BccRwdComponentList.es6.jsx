// IMPORTANT: Do not include BccRwdComponentList in any asyncRender components. Doing so will force
// it and all subcomponents to be included in the priority bundle

import React from 'react';
import { wrapComponent } from 'utils/framework';
import BaseClass from 'components/BaseClass';
import PropTypes from 'prop-types';
import BCCUtils from 'utils/BCC';
import { Box } from 'components/ui';
import BccRwdBanner from 'components/Bcc/BccRwdBanner';
import BccRwdCopy from 'components/Bcc/BccRwdCopy';
import BccRwdProductList from 'components/Bcc/BccRwdProductList';
import BccRwdPromoList from 'components/Bcc/BccRwdPromoList';
import BccRwdPersonalizedPromoList from 'components/Bcc/BccRwdPersonalizedPromoList';
import BccRwdSoftLinks from 'components/Bcc/BccRwdSoftLinks';
import BccRwdTargeter from 'components/Bcc/BccRwdTargeter';
import TestTarget from 'components/TestTarget/TestTarget';
import BccRwdRewardsList from 'components/Bcc/BccRwdRewardsList';

const { COMPONENT_NAMES, excludeForFrCA } = BCCUtils;

class BccRwdComponentList extends BaseClass {
    constructor(props) {
        super(props);
    }

    createItemsWithFlags = (items, enablePageRenderTracking, disableLazyLoadCount) => {
        const itemsWithFlags = (items || []).slice();
        const contentLength = itemsWithFlags.length;

        if (disableLazyLoadCount) {
            const max = disableLazyLoadCount <= contentLength ? disableLazyLoadCount : contentLength;

            for (let i = 0; i < max; i++) {
                itemsWithFlags[i] = Object.assign({}, itemsWithFlags[i]);
                itemsWithFlags[i].disableLazyLoad = true;
            }
        }

        if (enablePageRenderTracking) {
            const max = contentLength > 1 ? 2 : contentLength;

            for (let i = 0; i < max; i += 1) {
                itemsWithFlags[i].enablePageRenderTracking = true;
            }
        }

        return itemsWithFlags;
    };

    getBccComponent = bccComp => {
        return {
            [COMPONENT_NAMES.RWD_BANNER]: <BccRwdBanner {...bccComp} />,
            [COMPONENT_NAMES.RWD_COPY]: <BccRwdCopy {...bccComp} />,
            [COMPONENT_NAMES.RWD_PRODUCT_LIST]: <BccRwdProductList {...bccComp} />,
            [COMPONENT_NAMES.RWD_PROMO_LIST]: <BccRwdPromoList {...bccComp} />,
            [COMPONENT_NAMES.RWD_PERSONALIZED_PROMO_LIST]: <BccRwdPersonalizedPromoList {...bccComp} />,
            [COMPONENT_NAMES.RWD_SOFT_LINKS]: <BccRwdSoftLinks {...bccComp} />,
            [COMPONENT_NAMES.RWD_REWARDS_LIST]: <BccRwdRewardsList {...bccComp} />
        }[bccComp.componentType];
    };

    processItems = (components, page) => {
        const componentList =
            components &&
            components.map(bccComponent => {
                let comp;
                const bccComp = Object.assign({}, bccComponent);
                bccComp.context = this.props.context;
                bccComp.displayCount = Sephora.isMobile() ? 2 : bccComponent.displayCount > 0 ? bccComponent.displayCount : 4;
                bccComp.page = page;

                if (bccComp.componentType === COMPONENT_NAMES.RWD_TARGETER) {
                    return <BccRwdTargeter {...bccComp} />;
                }

                comp = this.getBccComponent(bccComp);

                if (excludeForFrCA(bccComp.style)) {
                    return null;
                }

                const { baseStyleProps } = this.props;
                let hasStyles = !!baseStyleProps;

                if (bccComp.style) {
                    hasStyles = true;
                    // Check for responsive style properties
                    Object.entries(bccComp.style).forEach(([key, value]) => {
                        if (value.includes(',')) {
                            bccComp.style[key] = value.split(',');
                        }
                    });
                }

                const compName = bccComp.testName || bccComp.name || bccComp.titleText;
                const WrapComponent = hasStyles ? Box : 'div';

                comp = comp && (
                    <WrapComponent
                        key={`bccRwdComponent_${compName}`}
                        id={compName?.replace(/ /g, '_').toLowerCase()}
                        {...baseStyleProps}
                        {...bccComp.style}
                        // handle case where nested component returns null
                        css={{ '&:empty': { display: 'none' } }}
                    >
                        {bccComp.enableTesting ? (
                            <TestTarget
                                testComponent={comp.type.class}
                                testName={compName}
                                testEnabled={true}
                                isBcc={true}
                                {...comp.props}
                            />
                        ) : (
                            comp
                        )}
                    </WrapComponent>
                );

                return comp;
            });

        return componentList;
    };

    render() {
        const { items, enablePageRenderTracking, disableLazyLoadCount, page } = this.props;

        const itemsWithFlags = this.createItemsWithFlags(items, enablePageRenderTracking, disableLazyLoadCount);
        const components = this.processItems(itemsWithFlags, page);

        if (!items || items.length <= 0 || !components || components.length <= 0) {
            return null;
        }

        return <>{components}</>;
    }
}

BccRwdComponentList.propTypes = {
    // allow array to be []
    items: PropTypes.array,
    /* where component list lives in the site */
    context: PropTypes.oneOf(['container', 'modal', 'inline']).isRequired,
    disableLazyLoadCount: PropTypes.number,
    enablePageRenderTracking: PropTypes.bool,
    /* base style properties for nested components */
    baseStyleProps: PropTypes.object
};

BccRwdComponentList.defaultProps = {
    context: 'container',
    enablePageRenderTracking: false
};

export default wrapComponent(BccRwdComponentList, 'BccRwdComponentList');
