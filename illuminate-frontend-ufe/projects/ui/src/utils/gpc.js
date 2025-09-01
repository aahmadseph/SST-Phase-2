import cookieUtils from 'utils/Cookies';

const ALLOWED_COOKIES = new Set(
    [
        'JSESSIONID',
        'site_locale',
        'site_language',
        'akamweb',
        'ConstructorioID_client_id',
        'akavpau_akaau',
        'mbox',
        'mboxEdgeCluster',
        'ship_country',
        'ccpaConsentCookie',
        'device_type',
        'current_country',
        'DYN_USER_ID',
        'DYN_USER_CONFIRM',
        'ATG_ORDER_CONTENT',
        'MPLUS_ORDER_CONTENT',
        'linkShareTime',
        'siteId',
        'forterToken',
        'j9yt5Pdb_dc',
        'rvi',
        'DID',
        'SSIT',
        'showIntlPopup',
        'showIntlPopupRedirect',
        'search_rel_segment',
        'MobileOptOut',
        'adbanners', // UTS-3194,
        'sephora_clarip_consent',
        'quebec_yes'
    ].map(e => e.toLowerCase())
);

const listCookiesAllowed = () => {
    const cookiesList = ALLOWED_COOKIES;

    // Checking for extra cookies from the settings
    const rawCookiesList = Sephora?.configurationSettings?.CCPAKeepCookieList;

    if (rawCookiesList) {
        try {
            rawCookiesList.split(',').forEach(name => cookiesList.add(name.toLowerCase()));
        } catch (error) {
            // eslint-disable-next-line no-console
            console.error(error);
        }
    }

    return cookiesList;
};

const deleteAllCookiesExceptAllowed = () => {
    const allowedCookies = listCookiesAllowed();

    (document?.cookie || '')
        .split(/; /)
        .map(e => e.split('=')[0])
        .filter(name => !allowedCookies.has(name.toLowerCase()))
        .forEach(toRemove => {
            cookieUtils.delete(toRemove);
            cookieUtils.delete(toRemove, true);
        });
};

export default { deleteAllCookiesExceptAllowed };
