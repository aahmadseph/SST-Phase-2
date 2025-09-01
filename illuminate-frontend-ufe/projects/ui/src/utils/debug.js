// MYK: Just tired of dragging this snippet around and removing before every
// commit. With this, just writing `require('utils/debug');` to have it working.

/* eslint-disable no-extend-native */
Promise.prototype.debug = function (prefix = 'Promise') {
    return this.then(data => {
        // eslint-disable-next-line no-console
        console.debug(prefix, 'THEN', data);

        return data;
    }).catch(reason => {
        // eslint-disable-next-line no-console
        console.error(prefix, 'CATCH', reason);

        return Promise.reject(reason);
    });
};
