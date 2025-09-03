import cookieUtils from 'utils/Cookies';

function isRCPShippingAPIEnabled() {
    const { enableProfileShippingGroup = false } = Sephora.configurationSettings;
    const isRCPShippingEnabled = cookieUtils.isRCPShippingAPIEnabled();

    return enableProfileShippingGroup && isRCPShippingEnabled;
}

function isRCPSAccountAPIEnabled() {
    const { enableProfileAccountGroup = false } = Sephora.configurationSettings;
    const isRCPShippingEnabled = cookieUtils.isRCPSAccountAPIEnabled();

    return enableProfileAccountGroup && isRCPShippingEnabled;
}

function isRCPSProfileInfoGroupAPIEnabled() {
    const { enableProfileInfoGroup = false } = Sephora.configurationSettings;
    const isRCPSProfileInfoGroupEnabled = cookieUtils.isRCPSProfileInfoGroupAPIEnabled();

    return enableProfileInfoGroup && isRCPSProfileInfoGroupEnabled;
}

function isRCPSProfileBiGroupAPIEnabled() {
    const { enableProfileBIGroup = false } = Sephora.configurationSettings;
    const isRCPSProfileBiGroupEnabled = cookieUtils.isRCPSProfileBiGroupAPIEnabled();

    return enableProfileBIGroup && isRCPSProfileBiGroupEnabled;
}

function isRCPSFullProfileGroup() {
    const { enablefullProfileGroup = false } = Sephora.configurationSettings;
    const isRCPSFullProfileGroupEnabled = cookieUtils.isRCPSFullProfileGroup();

    return enablefullProfileGroup && isRCPSFullProfileGroupEnabled;
}

function isRCPSCCAP() {
    const { isCCAPEnabled = false } = Sephora.configurationSettings;
    const isRCPSCCAPEnabled = cookieUtils.isRCPSCCAPEnabled();

    return isCCAPEnabled && isRCPSCCAPEnabled;
}

function isRCPSRwdBasketPersonalizationEnabled() {
    const { isBasketPersonalizationEnabled = false } = Sephora.configurationSettings;

    return isBasketPersonalizationEnabled;
}

function isRCPSAuthEnabled() {
    const { isNewAuthEnabled = false } = Sephora.configurationSettings;

    return isNewAuthEnabled && cookieUtils.isRCPSFullProfileGroup();
}

export default {
    isRCPShippingAPIEnabled,
    isRCPSAccountAPIEnabled,
    isRCPSProfileInfoGroupAPIEnabled,
    isRCPSProfileBiGroupAPIEnabled,
    isRCPSFullProfileGroup,
    isRCPSCCAP,
    isRCPSRwdBasketPersonalizationEnabled,
    isRCPSAuthEnabled
};
