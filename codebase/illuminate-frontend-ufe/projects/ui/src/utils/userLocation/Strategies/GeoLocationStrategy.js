import LocationStrategy from './LocationStrategy';
import LOCATION from './../Constants';
import { TIME_OUT } from 'constants/location';

const GeoLocationStrategy = function () {};

GeoLocationStrategy.prototype = new LocationStrategy();

GeoLocationStrategy.prototype.determineLocationAndCall = function (callback, failure) {
    if (navigator.geolocation) {
        if (navigator.permissions) {
            this.handleGeoLocationPermissions(callback, failure);
        } else {
            //some browsers don't support navigator.permissions
            this.next.determineLocationAndCall(callback, failure);
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.doCallback(position, callback);
                },
                undefined,
                { timeout: TIME_OUT }
            );
        }
    } else {
        this.next.determineLocationAndCall(callback, failure);
    }
};

GeoLocationStrategy.prototype.handleGeoLocationPermissions = function (callback, failure) {
    /*
     * if geolocation is already enabled by user, use lat and long for location
     * if we need user permission for geolocation, prompt user, but
     * set location to default until user either accepts or denies geolocation
     * if user has already blocked geolocation, use default location.
     */
    navigator.permissions.query({ name: 'geolocation' }).then(result => {
        if (result.state === 'granted') {
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.doCallback(position, callback);
                },
                () => {
                    this.next.determineLocationAndCall(callback, failure);
                },
                { timeout: TIME_OUT }
            );
        } else if (result.state === 'prompt') {
            this.next.determineLocationAndCall(callback, failure);
            navigator.geolocation.getCurrentPosition(
                position => {
                    this.doCallback(position, callback);
                },
                undefined,
                { timeout: TIME_OUT }
            );
        } else if (result.state === 'denied') {
            this.next.determineLocationAndCall(callback, failure);
        }
    });
};

GeoLocationStrategy.prototype.doCallback = function (position, callback) {
    if (position && position.coords && position.coords.latitude && position.coords.longitude) {
        callback({
            src: LOCATION.TYPES.GEOLOCATION,
            display: LOCATION.CURRENT_LOCATION_TEXT,
            lat: parseFloat(position.coords.latitude),
            lon: parseFloat(position.coords.longitude)
        });
    }
};

export default GeoLocationStrategy;
