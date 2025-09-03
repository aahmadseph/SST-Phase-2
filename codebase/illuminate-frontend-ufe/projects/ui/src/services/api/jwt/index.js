const ufeToken = 'JWT_AUTH_TOKEN';
import jwtToken from 'services/api/jwt/jwtToken';
import getAutoReplenishSubscriptions from 'services/api/productFrequency/getAutoReplenishSubscriptions';
import unsubscribeAutoReplenishment from 'services/api/productFrequency/unsubscribeAutoReplenishment';
import pauseAutoReplenishment from 'services/api/productFrequency/pauseAutoReplenishment';
import skipAutoReplenishment from 'services/api/productFrequency/skipAutoReplenishment';
import updateReplenishSubscriptions from 'services/api/productFrequency/updateReplenishSubscriptions';
import resumeAutoReplenishment from 'services/api/productFrequency/resumeAutoReplenishment';
import getSDUSubscription from 'services/api/subscriptions/sameDayUnlimited/getSDUSubscription';

const withJwtToken = jwtToken.withJwtToken;

export default {
    getAutoReplenishSubscriptions: withJwtToken(getAutoReplenishSubscriptions.getAutoReplenishSubscriptions, ufeToken),
    unsubscribeAutoReplenishment: withJwtToken(unsubscribeAutoReplenishment.unsubscribeAutoReplenishment, ufeToken),
    pauseAutoReplenishment: withJwtToken(pauseAutoReplenishment.pauseAutoReplenishment, ufeToken),
    skipAutoReplenishment: withJwtToken(skipAutoReplenishment.skipAutoReplenishment, ufeToken),
    updateReplenishSubscriptions: withJwtToken(updateReplenishSubscriptions.updateReplenishSubscriptions, ufeToken),
    resumeAutoReplenishment: withJwtToken(resumeAutoReplenishment.resumeAutoReplenishment, ufeToken),
    getSDUSubscription: withJwtToken(getSDUSubscription.getSDUSubscription, ufeToken)
};
