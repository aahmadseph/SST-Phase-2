import urlUtils from 'utils/Url';
import anaConsts from 'analytics/constants';

const { addParam } = urlUtils;
const { CMS_URL_PARAMS } = anaConsts;

const mountTargetUrlProp = (targetUrl, props) => {
    if (!targetUrl) {
        return '';
    }

    let newTargetUrl = targetUrl;

    const icid2 = `${props?.carouselTitle?.toLowerCase()}:${props?.title?.toLowerCase()}`;
    newTargetUrl = addParam(newTargetUrl, CMS_URL_PARAMS.icid2, icid2);

    if (props?.urlParams && Object.keys(props?.urlParams).length) {
        Object.keys(props?.urlParams).forEach(key => {
            newTargetUrl = CMS_URL_PARAMS[key] ? addParam(newTargetUrl, CMS_URL_PARAMS[key], props?.urlParams[key]) : newTargetUrl;
        });
    }

    return newTargetUrl;
};

export const targetUrl = (url, props) => {
    return mountTargetUrlProp(url, props);
};
