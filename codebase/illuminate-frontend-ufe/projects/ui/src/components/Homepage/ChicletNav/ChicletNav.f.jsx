import React from 'react';
import { wrapFunctionalComponent } from 'utils/framework';
import { colors, space, mediaQueries } from 'style/config';
import anaUtils from 'analytics/utils';
import Chiclet from 'components/Chiclet';
import Action from 'components/Content/Action';
import ShopMyStoreChiclet from 'components/ShopYourStore/ShopMyStoreChiclet';

const ActionChiclet = Action(Chiclet);

function ChicletNav({ menuItems }) {
    const Component = ActionChiclet;

    return menuItems ? (
        <div
            css={styles.chicletWrap}
            data-at={Sephora.debug.dataAt('category_chiclets')}
        >
            <ShopMyStoreChiclet />
            {menuItems.map((item, index) => {
                const componentSpecificProps = { action: item.link, children: item.label, dontUseInternalTracking: true };

                return (item.titleText && item.targetUrl) || (item.label && item.link) ? (
                    <Component
                        key={index.toString()}
                        variant='shadow'
                        {...componentSpecificProps}
                        onClick={() => {
                            anaUtils.setNextPageData({
                                navigationInfo: anaUtils.buildNavPath(['top nav', componentSpecificProps.children.toLowerCase()]),
                                internalCampaign: item.sid
                            });
                        }}
                        children={componentSpecificProps.children}
                        customCSS={styles.customCSS}
                    />
                ) : null;
            })}
        </div>
    ) : null;
}

const styles = {
    chicletWrap: {
        display: 'flex',
        gap: space[2],
        fontSize: 0,
        whiteSpace: 'nowrap',
        overflowX: 'auto',
        padding: space[2],
        textAlign: 'center',
        scrollbarWidth: 'none',
        borderBottom: `1px solid ${colors.lightGray}`,
        '&::-webkit-scrollbar': { display: 'none' },
        [mediaQueries.md]: {
            display: 'none'
        }
    },
    customCSS: {
        flex: '0 0 auto'
    }
};

export default wrapFunctionalComponent(ChicletNav, 'ChicletNav');
