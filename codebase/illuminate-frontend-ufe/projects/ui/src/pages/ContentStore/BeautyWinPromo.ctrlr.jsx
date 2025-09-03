/* eslint-disable class-methods-use-this */

import React from 'react';
import framework from 'utils/framework';
const { wrapComponent } = framework;
import BaseClass from 'components/BaseClass';

import BeautyWinPromoBody from 'components/BeautyWinPromo/BeautyWinPromoBody';
import { site } from 'style/config';
import LegacyGrid from 'components/LegacyGrid/LegacyGrid';
import LegacyContainer from 'components/LegacyContainer/LegacyContainer';
import ContentStoreLeftNav from 'components/ContentPage/ContentStoreLeftNav/ContentStoreLeftNav';

class BeautyWinPromo extends BaseClass {
    render() {
        const { regions = {}, ancestorHierarchy } = this.props;

        const isDesktop = Sephora.isDesktop();

        return (
            <LegacyContainer
                marginTop={isDesktop && site.BREADCRUMB_HEIGHT}
                data-at={Sephora.debug.dataAt('tlp_promo_container')}
            >
                <LegacyGrid>
                    {isDesktop && (
                        <LegacyGrid.Cell
                            width={site.SIDEBAR_WIDTH}
                            borderRight={1}
                            borderColor='midGray'
                            paddingRight={4}
                            lineHeight='tight'
                        >
                            <ContentStoreLeftNav
                                leftRegion={regions.left}
                                ancestorHierarchy={ancestorHierarchy}
                            />
                        </LegacyGrid.Cell>
                    )}
                    <LegacyGrid.Cell
                        is='main'
                        width={isDesktop && 'fill'}
                    >
                        <BeautyWinPromoBody {...this.props} />
                    </LegacyGrid.Cell>
                </LegacyGrid>
            </LegacyContainer>
        );
    }
}

export default wrapComponent(BeautyWinPromo, 'BeautyWinPromo', true);
