import Anchor from 'components/Content/Anchor';
import Banner from 'components/Content/Banner';
import BannerList from 'components/Content/BannerList';
import Copy from 'components/Content/Copy';
import Divider from 'components/Content/Divider';
import ProductList from 'components/Content/ProductList';
import PromotionList from 'components/Content/PromotionList';
import PromotionListForYouHandler from 'components/Content/PromotionListHandler/PromotionListForYouHandler';
import PromotionListFeaturedOffersHandler from 'components/Content/PromotionListHandler/PromotionListFeaturedOffersHandler';
import Recap from 'components/Content/Recap';
import RecapSYSHandler from 'components/Content/RecapHandler/RecapSYSHandler';
import RewardList from 'components/Content/RewardList';
import SectionHeading from 'components/Content/SectionHeading';
import SoftLinks from 'components/Content/SoftLinks';
import SMSOptIn from 'components/Content/SMSOptIn';
import Section from 'components/Section';
import CustomRendering from 'components/Content/CustomRendering';
import UgcWidget from 'components/Content/UgcWidget';
import LovesList from 'components/Content/LovesList';
import contentConstants from 'constants/content';

const { COMPONENT_TYPES, COMPONENT_HANDLER_TYPES } = contentConstants;

const cmsComponentMapping = {
    [COMPONENT_TYPES.ANCHOR]: Anchor,
    [COMPONENT_TYPES.BANNER_LIST]: BannerList,
    [COMPONENT_TYPES.BANNER]: Banner,
    [COMPONENT_TYPES.COPY]: Copy,
    [COMPONENT_TYPES.DIVIDER]: Divider,
    [COMPONENT_TYPES.PRODUCT_LIST]: ProductList,
    [COMPONENT_TYPES.PROMOTION_LIST]: PromotionList,
    [COMPONENT_TYPES.RECAP]: Recap,
    [COMPONENT_TYPES.REWARD_LIST]: RewardList,
    [COMPONENT_TYPES.SECTION_HEADING]: SectionHeading,
    [COMPONENT_TYPES.SOFT_LINKS]: SoftLinks,
    [COMPONENT_TYPES.SMS_OPTIN]: SMSOptIn,
    [COMPONENT_TYPES.SECTION]: Section,
    [COMPONENT_TYPES.CUSTOM_RENDERING]: CustomRendering,
    [COMPONENT_TYPES.UGC_WIDGET]: UgcWidget,
    [COMPONENT_TYPES.LOVES_LIST]: LovesList
};

const cmsComponentHandlerTypeMapping = {
    [COMPONENT_TYPES.PROMOTION_LIST]: {
        [COMPONENT_HANDLER_TYPES.PROMOTION_LIST.FOR_YOU]: PromotionListForYouHandler,
        [COMPONENT_HANDLER_TYPES.PROMOTION_LIST.FEATURED_OFFERS]: PromotionListFeaturedOffersHandler
    },
    [COMPONENT_TYPES.RECAP]: {
        [COMPONENT_HANDLER_TYPES.RECAP.RECAP_SYS]: RecapSYSHandler
    }
};

const getCmsComponent = ({ type, features = [] }) => {
    const handlerType = features?.[0]?.handlerType;
    const featureHandlerComponent = cmsComponentHandlerTypeMapping[type]?.[handlerType];

    return featureHandlerComponent ?? cmsComponentMapping[type];
};

export {
    cmsComponentMapping, getCmsComponent
};
