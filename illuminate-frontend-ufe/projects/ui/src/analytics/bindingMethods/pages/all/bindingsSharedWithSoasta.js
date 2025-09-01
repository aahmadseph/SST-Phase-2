/** These bindings live here because they are used by both Adobe and Soasta, and Soasta
 *** data needs to be available before page load. */

const PAGE_TYPES = {
    HOMEPAGE: 'home page',
    BASKET: 'basket',
    USER_PROFILE: 'user profile',
    CHECKOUT: 'checkout'
};

export default (function () {
    return {
        getPageType: function (path = []) {
            let type = path[1] || '';

            //Some page types need additional info to determine the page type
            if (type === 'richprofile') {
                if (path[2] && path[2] === 'profile') {
                    type = 'cmnty profile';
                }
            }

            return this.convertType(type);
        },

        /**
         * Takes a type that could come from anywhere and returns the
         * name that the reporting team wants to see for that page, module, etc.
         * @param  {string} type - The type to be converted.
         * @return {string} - The converted type if there was one, or the original argument.
         */
        convertType: function (type) {
            const map = {
                homepage: PAGE_TYPES.HOMEPAGE,
                basketpage: PAGE_TYPES.BASKET,
                richprofile: PAGE_TYPES.USER_PROFILE,
                bihq: PAGE_TYPES.USER_PROFILE,
                rwdcheckout: PAGE_TYPES.CHECKOUT,
                fscheckout: PAGE_TYPES.CHECKOUT
            };

            return map[type] || type;
        }
    };
}());
