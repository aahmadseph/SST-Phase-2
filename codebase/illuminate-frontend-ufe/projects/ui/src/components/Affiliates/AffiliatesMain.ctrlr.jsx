/* eslint-disable class-methods-use-this */
// eslint-disable-next-line no-unused-vars
import React from 'react';
import urlUtils from 'utils/Url';
import cookieUtils from 'utils/Cookies';
import dateUtils from 'utils/Date';
import { wrapComponent } from 'utils/framework';

import BaseClass from 'components/BaseClass';
import Storage from 'utils/localStorage/Storage';

import Empty from 'constants/empty';
import anaConsts from 'analytics/constants';
import anaUtils from 'analytics/utils';

// Rakuten recommends 730 days
const DEFAULT_COOKE_LIFETIME = anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_COOKIE_LIFETIME;

class AffiliatesMain extends BaseClass {
    componentDidMount() {
        const params = urlUtils.getParams();
        const redirectUrl = (params.url && params.url[0]) || '/';
        const siteId = params.siteID && params.siteID[0];
        const cookiesLifetime = this.props.linkshareCookiesLifetime || DEFAULT_COOKE_LIFETIME;
        // date must be in UTC
        const linkShareTime = dateUtils.formatISODateVariation();

        // Resets any previous stored parameters
        anaUtils.resetAffiliateGatewayParams();

        // Stores the affiliate parameters received so the TMS (Adobe Launch can send them to GA4)
        Storage.local.setItem(
            anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_PARAMETERS_STORAGE,
            {
                params,
                referrer: document.referrer || Empty.String,
                sotToRead: '1',
                linkshareTimeStamp: linkShareTime,
                gatewayLink: window?.location?.href || Empty.String,
                redirectUrl,
                siteId
            },
            DEFAULT_COOKE_LIFETIME * Storage.DAYS
        );

        // Append linkShareTime with "|siteID" per CE requerment (ILLUPH-126746)
        cookieUtils.write(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_LINKSHARETIME_COOKIE, `${linkShareTime}|${siteId}`, cookiesLifetime, false);
        siteId && cookieUtils.write(anaConsts.AFFILIATE_PARAMETERS.AFFILIATE_SITEID_COOKIE, siteId, cookiesLifetime, false);
        urlUtils.redirectTo(redirectUrl);
    }

    render() {
        return null;
    }
}

export default wrapComponent(AffiliatesMain, 'AffiliatesMain', true);
