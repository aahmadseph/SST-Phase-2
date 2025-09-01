import cookieUtils from 'utils/Cookies';

function isNGPUserRegistrationEnabled() {
    const { useNGPRegistration = false } = Sephora.configurationSettings;
    const isNGPUserRegEnabled = cookieUtils.isNGPUserRegEnabled();

    return useNGPRegistration && isNGPUserRegEnabled;
}

export default {
    isNGPUserRegistrationEnabled
};
