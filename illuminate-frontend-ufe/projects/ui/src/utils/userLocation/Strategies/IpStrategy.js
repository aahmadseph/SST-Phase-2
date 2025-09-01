/*global google*/
import LocationStrategy from './LocationStrategy';
import LOCATION from './../Constants';
import utilityApi from 'services/api/utility';
import localeUtils from 'utils/LanguageLocale';

const IpStrategy = function () {};

IpStrategy.prototype = new LocationStrategy();

IpStrategy.prototype.getGeocoder = function () {
    return new google.maps.Geocoder();
};

IpStrategy.prototype.determineLocationAndCall = function (callback, failure) {
    utilityApi.getLocation({ radius: localeUtils.getCountrySearchRadius() }).then(
        data => {
            this.parseLocatorData(data, callback, failure);
        },
        () => {
            this.next.determineLocationAndCall(callback, failure);
        }
    );
};

IpStrategy.prototype.parseLocatorData = function (data, callback, failure) {
    if (!data || !data.location || !data.location.latitude || !data.location.longitude) {
        this.next.determineLocationAndCall(callback, failure);

        return;
    }

    const latlng = {
        lat: parseFloat(data.location.latitude),
        lng: parseFloat(data.location.longitude)
    };
    const country = data.location.countryCode;

    // use geocode to get city, state location since api doesn't return
    // friendly format i.e. (SANFRANCISCO, NEWYORK, etc.)
    const geocoder = this.getGeocoder();
    geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === 'OK' && Array.isArray(results)) {
            //result with types locality and political have a formatted address of
            //City, State, Country which is exactly what we need to for display purposes
            //however we are keeping api country code instead of geocode country name
            //for API compatibility with country format
            const locationResult = results.filter(result => {
                return result.types.toString() === 'locality,political';
            });

            if (locationResult.length === 0 || !locationResult[0].formatted_address) {
                this.next.determineLocationAndCall(callback, failure);

                return;
            }

            const formattedAddress = locationResult[0].formatted_address.split(',');
            let display = formattedAddress[0].trim();

            if (formattedAddress[1]) {
                display += `, ${formattedAddress[1].trim()}`;
            }

            const locationObj = {
                src: LOCATION.TYPES.IP,
                display,
                lat: latlng.lat,
                lon: latlng.lng
            };

            if (localeUtils.isValidCountry(country)) {
                locationObj.country = country;
            }

            callback(locationObj, data.stores);
        } else {
            this.next.determineLocationAndCall(callback, failure);
        }
    });
};

export default IpStrategy;
