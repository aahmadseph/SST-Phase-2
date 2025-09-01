import getUserElegibleRewardsSkus from '#server/services/apiOrchestration/rewards/getUserElegibleRewardsSkus.mjs';

export default function addLoyaltyRewardsRoutes(app) {
    app.get(/\/gapi\/loyalty-rewards\/.*\/elegible-rewards*/, getUserElegibleRewardsSkus);
}
