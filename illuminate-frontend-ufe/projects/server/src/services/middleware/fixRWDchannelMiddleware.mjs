import {
    CHANNELS
} from '#server/services/utils/Constants.mjs';

export default function fixRWDchannelMiddleware(request, response, next) {
    const {
        channel
    } = request.apiOptions;

    if (channel !== CHANNELS.IPHONE_APP && channel !== CHANNELS.ANDROID_APP) {
        request.apiOptions.channel = CHANNELS.RWD;
    }

    next();
}
