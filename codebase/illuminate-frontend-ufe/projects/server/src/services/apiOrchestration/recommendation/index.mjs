import getRecoProductDetails from '#server/services/apiOrchestration/recommendation/getRecoProductDetails.mjs';
import getRecoProducts from '#server/services/apiOrchestration/recommendation/getRecoProducts.mjs';

export default function addRecommendationRoutes(app) {
    app.get(/\/gapi\/recommendation\/details\/P[0-9]*/, getRecoProductDetails);
    app.get(/\/gapi\/recommendation\/substitution\/P[0-9]*/, getRecoProducts);
}
