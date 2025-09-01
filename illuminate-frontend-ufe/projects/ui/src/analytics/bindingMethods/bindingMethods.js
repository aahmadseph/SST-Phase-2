/**
 * This module becomes a property of Sephora.analytics.
 *
 * Its purpose is to organize the methods used to
 * gather analytics data based on the page or scenario.
 *
 * Dependencies: analytics/utils.js
 */

import generalBindings from 'analytics/bindingMethods/pages/all/generalBindings';
import quickLookBindings from 'analytics/bindingMethods/pages/all/quickLookBindings';

export default (function () {
    var methods = {
        pages: {
            all: {
                general: generalBindings,
                quickLook: quickLookBindings
            }
        }
    }; //End Methods

    return methods;
}());
