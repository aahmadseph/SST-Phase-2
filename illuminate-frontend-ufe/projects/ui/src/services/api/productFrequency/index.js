import getProductFrequency from 'services/api/productFrequency/getProductFrequency';
import getAutoReplenishSubscriptions from 'services/api/productFrequency/getAutoReplenishSubscriptions';
import unsubscribeAutoReplenishment from 'services/api/productFrequency/unsubscribeAutoReplenishment';
import pauseAutoReplenishment from 'services/api/productFrequency/pauseAutoReplenishment';
import skipAutoReplenishment from 'services/api/productFrequency/skipAutoReplenishment';
import resumeAutoReplenishment from 'services/api/productFrequency/resumeAutoReplenishment';
import updateReplenishSubscriptions from 'services/api/productFrequency/updateReplenishSubscriptions';

export default {
    getProductFrequency: getProductFrequency,
    getAutoReplenishSubscriptions: getAutoReplenishSubscriptions.getAutoReplenishSubscriptions,
    unsubscribeAutoReplenishment: unsubscribeAutoReplenishment.unsubscribeAutoReplenishment,
    pauseAutoReplenishment: pauseAutoReplenishment.pauseAutoReplenishment,
    skipAutoReplenishment: skipAutoReplenishment.skipAutoReplenishment,
    resumeAutoReplenishment: resumeAutoReplenishment.resumeAutoReplenishment,
    updateReplenishSubscriptions: updateReplenishSubscriptions.updateReplenishSubscriptions
};
