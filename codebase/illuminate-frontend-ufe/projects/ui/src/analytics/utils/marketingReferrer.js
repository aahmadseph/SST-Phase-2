import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import urlUtils from 'utils/Url';

/**
 * Analytics Marketing Referrer Functions *
 */

const storeReferrer = () => {
    const url = window.location.href;
    const omMmc = urlUtils.getParamsByName(LOCAL_STORAGE.OM_MMC_PARAMETER, url) || '';
    const clickId = urlUtils.getParamsByName(LOCAL_STORAGE.CLICK_ID_PARAMETER, url) || '';
    const sephoraRegExp = /.*\.sephora\..*/;
    const referrer = document.referrer || '';

    // Overwrite the om_mmc value in session storage
    if (omMmc !== '') {
        Storage.session.setItem(LOCAL_STORAGE.OM_MMC_PARAMETER, omMmc);
    }

    // Overwrite the click_id value in session storage
    if (clickId !== '') {
        Storage.session.setItem(LOCAL_STORAGE.CLICK_ID_PARAMETER, clickId);
    }

    // Overwrite the referrer value in session storage if it doesn't match with the sephora.com domain.
    if (referrer !== '' && referrer.search(sephoraRegExp) === -1) {
        Storage.session.setItem(LOCAL_STORAGE.MARKETING_REFERRER, referrer);
    }

    // Default value.
    if (referrer === '') {
        Storage.session.setItem(LOCAL_STORAGE.MARKETING_REFERRER, 'direct');
    }
};

export default { storeReferrer };
