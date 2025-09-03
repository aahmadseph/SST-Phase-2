import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import FrameworkUtils from 'utils/framework';
import { p13nSelector } from 'selectors/p13n/p13nSelector';
import { coreUserDataSelector } from 'viewModel/selectors/user/coreUserDataSelector';
import Empty from 'constants/empty';
import PersonalizationUtils from 'utils/Personalization';
import { headerAndFooterSelector } from 'selectors/headerAndFooter/headerAndFooterSelector';
import { showBlackSearchHeaderSelector } from 'viewModel/selectors/testTarget/showBlackSearchHeaderSelector';
import { isShopYourStoreEnabledSelector } from 'viewModel/selectors/shopYourStore/isShopYourStoreEnabledSelector';

const { getMegaNavPersonalizedComponent } = PersonalizationUtils;
const { wrapHOC } = FrameworkUtils;
const fields = createSelector(
    p13nSelector,
    coreUserDataSelector,
    (_state, ownProps) => ownProps.headerFooterContent,
    (_state, ownProps) => ownProps.personalization,
    headerAndFooterSelector,
    showBlackSearchHeaderSelector,
    isShopYourStoreEnabledSelector,
    (p13n, user, headerFooterContent, personalization, headerAndFooter, showBlackSearchHeader, isShopYourStoreEnabled) => {
        let personalizedComponent = Empty.Array;

        if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
            personalizedComponent = getMegaNavPersonalizedComponent(p13n, personalization, user);
        }

        const navItems = personalizedComponent?.variationData?.items || headerFooterContent?.megaNav?.items || Empty.Array;
        const menuItems = [...navItems];

        return {
            menuItems,
            user,
            p13n,
            isCompact: headerAndFooter.isCompact,
            showBlackSearchHeader,
            isShopYourStoreEnabled
        };
    }
);
const withHeaderProps = wrapHOC(connect(fields));

export {
    fields, withHeaderProps
};
