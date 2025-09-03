import StoreIdStrategy from './Strategies/StoreIdStrategy';
import ZipStrategy from './Strategies/ZipStrategy';
import StorageStrategy from './Strategies/StorageStrategy';
import GeoLocationStrategy from './Strategies/GeoLocationStrategy';
import IpStrategy from './Strategies/IpStrategy';
import DefaultStrategy from './Strategies/DefaultStrategy';
import localeUtils from 'utils/LanguageLocale';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';
import LOCATION from './Constants';

const STRATEGIES = {
    URL_STORE_ID: 'URL_STORE_ID',
    URL_ZIP: 'URL_ZIP',
    STORAGE: 'STORAGE',
    GEOLOCATION: 'GEOLOCATION',
    IP: 'IP',
    DEFAULT: 'DEFAULT'
};

/*
    Each strategy represents a way to obtain current user location and
    must implement determineLocationAndCall(success, failure) method.
    If it is possible to determine the location with a strategy,
    success callback should be called with (locationObj, storesList = null)
    Otherwise next strategy's determineLocationAndCall method should be called.
    When there is no strategies left, failure callback will be called (see LocationStrategy.js)

    By chaining the strategies in different sequences
    we can build custom pipelines depending on the current page or any other conditions.
    See presets in this.getDefaultStrategiesSequence and this.getHubStrategiesSequence

    Adding a new strategy, ensure it inherits './Strategies/LocationStrategy'
    Otherwise it could not be chained.
    NewStrategy.prototype = new LocationStrategy();
*/

const UserLocation = {
    getHubStrategiesMap: function () {
        return {
            [STRATEGIES.URL_STORE_ID]: () => new StoreIdStrategy(),
            [STRATEGIES.URL_ZIP]: () => new ZipStrategy(),
            [STRATEGIES.STORAGE]: () => new StorageStrategy(),
            [STRATEGIES.GEOLOCATION]: () => new GeoLocationStrategy(),
            [STRATEGIES.IP]: () => new IpStrategy(),
            [STRATEGIES.DEFAULT]: () => new DefaultStrategy()
        };
    },

    getDefaultStrategiesSequence: function () {
        return [STRATEGIES.STORAGE, STRATEGIES.GEOLOCATION, STRATEGIES.IP, STRATEGIES.DEFAULT];
    },

    getHubStrategiesSequence: function () {
        return [STRATEGIES.URL_ZIP, STRATEGIES.URL_STORE_ID, STRATEGIES.STORAGE, STRATEGIES.GEOLOCATION, STRATEGIES.IP, STRATEGIES.DEFAULT];
    },

    getEdpStrategiesSequence: function () {
        return [STRATEGIES.URL_ZIP, STRATEGIES.STORAGE, STRATEGIES.GEOLOCATION, STRATEGIES.IP, STRATEGIES.DEFAULT];
    },

    determineLocation: function (callback, failure, config = {}) {
        const sequence = config.sequence || this.getDefaultStrategiesSequence();
        const strategiesMap = this.getHubStrategiesMap();
        const strategies = sequence.map(key => strategiesMap[key]);
        let currentStrategy = strategies.shift()();
        const strategiesPipeline = currentStrategy;
        // build strategies chain
        strategies.forEach(strategy => {
            currentStrategy = currentStrategy.setNext(strategy());
        });

        strategiesPipeline.determineLocationAndCall(
            (locationObj, storesList = null) => {
                callback(locationObj, storesList);
            },
            () => {
                typeof failure === 'function' && failure();
            }
        );
    },

    getLocationFromPosition: function (position) {
        if (!position || !position.coords || !position.coords.latitude || !position.coords.longitude) {
            return null;
        }

        return {
            src: LOCATION.TYPES.GEOLOCATION,
            display: LOCATION.CURRENT_LOCATION_TEXT,
            lat: parseFloat(position.coords.latitude),
            lon: parseFloat(position.coords.longitude)
        };
    },

    getLocationFromPrediction: function (prediction) {
        if (!prediction || !prediction.terms || !prediction.geometry || !prediction.geometry.location || prediction.terms.length < 2) {
            return null;
        }

        const locationObj = {
            src: LOCATION.TYPES.PREDICTION,
            lat: parseFloat(prediction.geometry.location.lat()),
            lon: parseFloat(prediction.geometry.location.lng())
        };

        // determine display text in the following order:
        //  - "zip/postal code" if prediction is zip or postal code
        //  - "City, State" if prediction.terms contains both
        //  - "City" or any other location name otherwise
        let locationDisplayName = '';
        const mainPredictionText =
            prediction.structured_formatting && prediction.structured_formatting.main_text ? prediction.structured_formatting.main_text : null;

        if (mainPredictionText && (localeUtils.isZipCode(mainPredictionText) || localeUtils.isPostalCode(mainPredictionText))) {
            locationDisplayName = prediction.structured_formatting.main_text;
        }

        if (!locationDisplayName) {
            const terms = prediction.terms;

            // possible values are 'City, Country'
            // or 'City, State, Country'
            if (terms.length === 2) {
                locationDisplayName = terms[0].value;
            } else {
                locationDisplayName = `${terms[0].value}, ${terms[1].value}`;
            }
        }

        locationObj.display = locationDisplayName;

        // finding country
        if (prediction.addressComponents) {
            const country = prediction.addressComponents
                .filter(result => {
                    return result.types.toString() === 'country,political';
                })
                .shift();

            if (country && country.short_name && localeUtils.isValidCountry(country.short_name)) {
                locationObj.country = country.short_name;
            }
        }

        return locationObj;
    },

    hasUrlBasedSource: function (locationObj) {
        return !!locationObj.src && LOCATION.URL_BASED_TYPES.some(el => el === locationObj.src);
    },

    setNewLocation: function (locationObj) {
        try {
            this.removeStorageLocation();
            const isSortable = locationObj.src && LOCATION.STORABLE_TYPES.some(el => el === locationObj.src);

            if (isSortable) {
                this.setStorageLocation(locationObj);
                this.addToPreviousLocationsList(locationObj);
            }
        } catch (e) {
            // continue even if location cannot be saved
        }
    },

    setStorageLocation: function (locationObj) {
        Storage.local.setItem(LOCAL_STORAGE.EXPERIENCE_LOCATION, locationObj);
    },

    removeStorageLocation: function () {
        Storage.local.removeItem(LOCAL_STORAGE.EXPERIENCE_LOCATION);
    },

    addToPreviousLocationsList: function (locationObj) {
        const currentList = Storage.local.getItem(LOCAL_STORAGE.PREVIOUS_EXPERIENCE_LOCATIONS) || [];
        let updatedList = currentList.filter(prevLocation => prevLocation.display !== locationObj.display);
        updatedList.unshift(locationObj);
        updatedList = updatedList.slice(0, LOCATION.STORAGE_MAX_SIZE);
        Storage.local.setItem(LOCAL_STORAGE.PREVIOUS_EXPERIENCE_LOCATIONS, updatedList);
    }
};

export default UserLocation;
