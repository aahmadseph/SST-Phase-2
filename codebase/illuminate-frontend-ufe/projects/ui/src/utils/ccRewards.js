import cookieUtils from 'utils/Cookies';

function isCCREnabled() {
    const { isCCRewardsEnabled } = Sephora.configurationSettings;
    const isRCPSCCEnabled = cookieUtils.isRCPSCCEnabled();

    if (isCCRewardsEnabled && isRCPSCCEnabled) {
        return true;
    }

    return false;
}

export default isCCREnabled;
