import {
    SDN_API_HOST,
    SDN_API_PORT,
    SDN_ANDROID_CLIENT_SECRET,
    SDN_ANDROID_CLIENT_ID,
    SDN_IOS_CLIENT_SECRET,
    SDN_IOS_CLIENT_ID,
    SDN_UFE_CLIENT_SECRET,
    SDN_UFE_CLIENT_ID,
    SDN_BV_CLIENT_SECRET,
    SDN_BV_CLIENT_ID,
    SDN_OLR_CLIENT_SECRET,
    SDN_OLR_CLIENT_ID
} from '#server/config/envRouterConfig.mjs';
import {
    CHANNELS,
    SDN_CHANNELS
} from '#server/services/utils/Constants.mjs';

const SDN_CONFIG = {
    sndAPIHost: SDN_API_HOST,
    sndAPIPort: SDN_API_PORT
};

const SDN_AUTH_CONFIG = {
    [CHANNELS.ANDROID_APP]: {
        authClientSecret: SDN_ANDROID_CLIENT_SECRET,
        authClientId: SDN_ANDROID_CLIENT_ID
    },
    [CHANNELS.IPHONE_APP]: {
        authClientSecret: SDN_IOS_CLIENT_SECRET,
        authClientId: SDN_IOS_CLIENT_ID
    },
    [CHANNELS.WEB]: {
        authClientSecret: SDN_UFE_CLIENT_SECRET,
        authClientId: SDN_UFE_CLIENT_ID
    },
    [CHANNELS.RWD]: {
        authClientSecret: SDN_UFE_CLIENT_SECRET,
        authClientId: SDN_UFE_CLIENT_ID
    },
    [CHANNELS.UFE]: {
        authClientSecret: SDN_UFE_CLIENT_SECRET,
        authClientId: SDN_UFE_CLIENT_ID
    },
    [SDN_CHANNELS.BV]: {
        authClientSecret: SDN_BV_CLIENT_SECRET,
        authClientId: SDN_BV_CLIENT_ID
    },
    [SDN_CHANNELS.OLR]: {
        authClientSecret: SDN_OLR_CLIENT_SECRET,
        authClientId: SDN_OLR_CLIENT_ID
    }
};

export {
    SDN_CONFIG,
    SDN_AUTH_CONFIG
};
