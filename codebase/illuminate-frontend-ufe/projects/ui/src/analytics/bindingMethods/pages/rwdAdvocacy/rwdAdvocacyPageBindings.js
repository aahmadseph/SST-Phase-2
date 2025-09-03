import anaConsts from 'analytics/constants';
import { PAGE_TYPES } from 'components/Campaigns/Referrer/constants';

const { ERROR_PAGE } = PAGE_TYPES;
const {
    PAGE_TYPES: { ADV_REFERRER },
    PAGE_NAMES: { ADV_CAMPAIGNS }
} = anaConsts;

function setPageLoadAnaytics(pageType) {
    digitalData.page.category.pageType = ADV_REFERRER;
    digitalData.page.pageInfo.pageName = `${ADV_CAMPAIGNS}${pageType === ERROR_PAGE ? '-error' : ''}`;
}

export default { setPageLoadAnaytics };
