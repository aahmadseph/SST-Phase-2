import LocationStrategy from './LocationStrategy';
import Storage from 'utils/localStorage/Storage';
import LOCAL_STORAGE from 'utils/localStorage/Constants';

const StorageStrategy = function () {};

StorageStrategy.prototype = new LocationStrategy();

StorageStrategy.prototype.determineLocationAndCall = function (callback, failure) {
    const locationObj = Storage.local.getItem(LOCAL_STORAGE.EXPERIENCE_LOCATION);

    if (locationObj) {
        callback(locationObj);

        return;
    }

    this.next.determineLocationAndCall(callback, failure);
};

export default StorageStrategy;
