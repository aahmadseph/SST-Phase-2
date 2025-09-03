import localeUtils from 'utils/LanguageLocale';

export default {
    EARTH_RADIUS: {
        KM: 6371,
        MI: 3959
    },

    getDefaultDistanceConfig: function () {
        return localeUtils.isUS()
            ? {
                units: localeUtils.DISTANCE_UNITS.US,
                threshold: localeUtils.SEARCH_RADIUS.US
            }
            : {
                units: localeUtils.DISTANCE_UNITS.CA,
                threshold: localeUtils.SEARCH_RADIUS.CA
            };
    },

    getDistance: function (
        srcLat,
        srcLon,
        dstLat,
        dstLon,
        {
            units = localeUtils.DISTANCE_UNITS.US, // units of measurement (mi, km)
            threshold = null // if specified, returns distance only if <= threshold
        }
    ) {
        const toRadians = dist => (dist * Math.PI) / 180;

        const latDelta = toRadians(dstLat - srcLat);
        const lonDelta = toRadians(dstLon - srcLon);
        const latSrc = toRadians(srcLat);
        const latDst = toRadians(dstLat);
        const radius = units === localeUtils.DISTANCE_UNITS.US ? this.EARTH_RADIUS.MI : this.EARTH_RADIUS.KM;

        const angle =
            Math.sin(latDelta / 2) * Math.sin(latDelta / 2) + Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2) * Math.cos(latSrc) * Math.cos(latDst);
        const d = 2 * Math.atan2(Math.sqrt(angle), Math.sqrt(1 - angle));
        const distance = radius * d;

        return !threshold ? distance : parseFloat(threshold) >= distance ? distance : null;
    }
};
