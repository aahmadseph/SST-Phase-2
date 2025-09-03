/*global google*/
import LocationStrategy from './LocationStrategy';
import urlUtils from 'utils/Url';
import localeUtils from 'utils/LanguageLocale';
import LOCATION from './../Constants';

const ZipStrategy = function () {};

ZipStrategy.prototype = new LocationStrategy();

ZipStrategy.prototype.getGeocoder = function () {
    return new google.maps.Geocoder();
};

ZipStrategy.prototype.determineLocationAndCall = function (callback, failure) {
    const urlParams = urlUtils.getParams();

    if (urlParams && urlParams.zipCode) {
        const geocoder = this.getGeocoder();
        geocoder.geocode({ address: urlParams.zipCode[0] }, (results, status) => {
            if (status !== 'OK' || !results[0] || !results[0].geometry) {
                this.next.determineLocationAndCall(callback, failure);

                return;
            }

            const location = results[0].geometry.location;
            const locationObj = {
                src: LOCATION.TYPES.URL_ZIP,
                display: urlParams.zipCode[0],
                lat: parseFloat(location.lat()),
                lon: parseFloat(location.lng())
            };

            // finding country
            if (results[0].address_components) {
                const country = results[0].address_components
                    .filter(result => {
                        return result.types.toString() === 'country,political';
                    })
                    .shift();

                if (country && country.short_name && localeUtils.isValidCountry(country.short_name)) {
                    locationObj.country = country.short_name;
                }
            }

            callback(locationObj);
        });

        return;
    }

    this.next.determineLocationAndCall(callback, failure);
};

export default ZipStrategy;
