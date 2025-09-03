import { connect } from 'react-redux';
import { createSelector } from 'reselect';
import framework from 'utils/framework';
import { itemsSelector } from 'selectors/page/headerFooterTemplate/data/megaNav/items/itemsSelector';
const { p13nSelector } = require('selectors/p13n/p13nSelector');
const { coreUserDataSelector } = require('viewModel/selectors/user/coreUserDataSelector');
const { megaNavSelector } = require('selectors/page/headerFooterTemplate/data/megaNav/megaNavSelector');
const { getMegaNavPersonalizedComponent } = require('utils/Personalization').default;
const Empty = require('constants/empty').default;

const { wrapHOC } = framework;

const fields = createSelector(itemsSelector, p13nSelector, coreUserDataSelector, megaNavSelector, (items, p13n, user, megaNavData) => {
    let personalizedComponent = Empty.Array;

    if (!Sephora.isNodeRender && Sephora.Util.InflatorComps.services.loadEvents.HydrationFinished) {
        personalizedComponent = getMegaNavPersonalizedComponent(p13n, megaNavData.personalization, user);
    }

    const navItems = (!user.isAnonymous && personalizedComponent?.variationData?.items) || items || Empty.Array;

    const menuItems = [...navItems];

    return {
        menuItems
    };
});

const withNavigationMenu = wrapHOC(connect(fields));

export {
    fields, withNavigationMenu
};
