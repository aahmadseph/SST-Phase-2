import LocationStrategy from './LocationStrategy';
import LOCATION from './../Constants';

const DefaultStrategy = function () {};

DefaultStrategy.prototype = new LocationStrategy();

DefaultStrategy.prototype.determineLocationAndCall = function (callback) {
    callback(Object.assign({ src: LOCATION.TYPES.DEFAULT }, LOCATION.DEFAULT_LOCATION));
};

export default DefaultStrategy;
