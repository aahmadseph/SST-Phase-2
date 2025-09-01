const LocationStrategy = function () {
    // no successor found in the sequence -> call failure
    this.next = {
        determineLocationAndCall: function (callback, failure) {
            failure();
        }
    };
};

LocationStrategy.prototype.setNext = function (next) {
    this.next = next;

    return next;
};

LocationStrategy.prototype.determineLocationAndCall = function () {};

export default LocationStrategy;
