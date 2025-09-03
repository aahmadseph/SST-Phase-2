/**
 * This file just includes all the files needed for analytics.
 */

import anaUtils from 'analytics/utils';
import anaConfigs from 'analytics/configurations';
import anaConsts from 'analytics/constants';
import processEvent from 'analytics/processEvent';
import 'analytics/dataLayer/digitalData';

export default (async function () {
    //These are made globally accessible so they can be used within Signal
    Sephora.analytics.utils = anaUtils;
    Sephora.analytics.config = anaConfigs.getConfigs();
    Sephora.analytics.constants = anaConsts;

    //ProcessEvent globally available for Third Parties
    Sephora.analytics.processEvent = processEvent;

    //Populate this property here to avoid problems with circular references.
    Sephora.analytics.constants.GET_MOST_RECENT_EVENT = Sephora.analytics.utils.getMostRecentEvent;
}());
