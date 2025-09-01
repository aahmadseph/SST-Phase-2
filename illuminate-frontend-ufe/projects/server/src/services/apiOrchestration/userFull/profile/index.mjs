import getShippingAndCreditCards from '#server/services/apiOrchestration/userFull/profile/getShippingAndCreditCards.mjs';
import getProfileById from '#server/services/apiOrchestration/userFull/profile/getProfileById.mjs';

export default function addProfileAPI(app) {
    app.get(/\/gapi\/users\/profiles\/[a-zA-Z0-9]*\/addressAndPayment*/, getShippingAndCreditCards);
    app.get(/\/gapi\/users\/profiles\/[a-zA-Z0-9]*\?*/, getProfileById);
}
