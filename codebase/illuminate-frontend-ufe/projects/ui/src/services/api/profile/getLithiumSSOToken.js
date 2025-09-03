import ufeApi from 'services/api/ufeApi';
import RCPSCookies from 'utils/RCPSCookies';

/**
 *
 * @param {*} profileId
 * @returns
 */
async function getLithiumSSOToken(profileId) {
    const { enableNGPLithiumToken = false } = Sephora.configurationSettings;
    let url = `/api/users/profiles/${profileId}/lithiumSsoToken`;
    const options = { method: 'GET' };

    // Call sdn for lith token if rcps_full_profile_group cookie is true
    if (RCPSCookies.isRCPSFullProfileGroup()) {
        url = `/gway/v2/user/profile/lithiumSSOToken/${profileId}`;
    }

    if (enableNGPLithiumToken) {
        url = `/gway/v2/user/profile/lithiumSSOToken/${profileId}?useNGPFlow=true`;
    }

    try {
        const data = await ufeApi.makeRequest(url, options);

        if (data.errorCode) {
            throw data;
        }

        return data.lithiumSsoToken;
    } catch (error) {
        Sephora.logger.verbose('FAILED TO GET LITHIUM TOKEN', error);
        throw new Error(error);
    }
}

export default getLithiumSSOToken;
