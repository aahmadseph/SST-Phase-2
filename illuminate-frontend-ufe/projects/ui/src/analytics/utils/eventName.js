import anaConsts from 'analytics/constants';
import PageTemplateType from 'constants/PageTemplateType';
import { SECTIONS } from 'components/Rmn/constants';

const legacyEventNames = {
    banner: {
        click: anaConsts.EVENT_NAMES.PLA_SPONSORED_BANNER_CLICK,
        impression: anaConsts.EVENT_NAMES.PLA_SPONSORED_BANNER_VIEWABLE_IMPR
    },
    pla: {
        click: anaConsts.EVENT_NAMES.PLA_SPONSORED_PRODUCT_CLICK,
        impression: anaConsts.EVENT_NAMES.PLA_SPONSORED_PRODUCT_VIEWABLE_IMPR
    }
};

// To future reference, the following are the components and their respective event types:
// const components = {
//     banner: 'banner',
//     pla: 'pla'
// };

export const mountPLAEventName = ({ page, component, section, type }) => {
    const { RMN_UFE_EVENT } = anaConsts;

    if (!page || !component || !section || !type) {
        !Sephora.isJestEnv &&
            // eslint-disable-next-line no-console
            console.warn(
                'Missing required parameters, the event name will not be generated. Please provide the required parameters: page, component, section, type'
            );

        return legacyEventNames[component][type];
    }

    switch (component) {
        case 'pla':
            return `${RMN_UFE_EVENT}.${page}.pla.${section}.${type}`;
        case 'banner':
            return `${RMN_UFE_EVENT}.${page}.banner.${section}.${type}`;
        default:
            return legacyEventNames[component][type];
    }
};

const { RMN_PAGE_NAMES } = anaConsts;

export const getCurrentPage = () => {
    const template = Sephora.template;

    switch (template) {
        case PageTemplateType.ProductPage:
            return RMN_PAGE_NAMES.pdp;
        case PageTemplateType.NthCategory:
            return RMN_PAGE_NAMES.category;
        case PageTemplateType.Search:
            return RMN_PAGE_NAMES.search;
        default:
            return 'n/a';
    }
};

export const mountBannerEventData = ({ type, section, targetPage }) => {
    const defaultPage = getCurrentPage();
    const page = targetPage ?? defaultPage;

    const bannerPosition = {
        [SECTIONS.MAIN]: 'leaderboard',
        [SECTIONS.SIDEBAR]: 'siderail',
        pdp: 'mid_page'
    };

    return mountPLAEventName({
        page,
        type,
        section: page === RMN_PAGE_NAMES.pdp ? bannerPosition.pdp : bannerPosition[section],
        component: 'banner'
    });
};

export const mountCarouselEventData = type => {
    const page = getCurrentPage();

    return mountPLAEventName({
        page,
        type,
        section: 'carousel',
        component: 'pla'
    });
};

export const mountGridEventData = type => {
    const page = getCurrentPage();

    return mountPLAEventName({
        page,
        type,
        section: 'in_grid',
        component: 'pla'
    });
};

export const mountProductEventData = type => {
    const page = getCurrentPage();

    return mountPLAEventName({
        page,
        type,
        section: page === RMN_PAGE_NAMES.pdp ? 'carousel' : 'in_grid',
        component: 'pla'
    });
};
