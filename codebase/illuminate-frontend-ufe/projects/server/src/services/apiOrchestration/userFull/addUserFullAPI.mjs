import getUserFull from '#server/services/apiOrchestration/userFull/getUserFull.mjs';

export default function addUserFullAPI(app) {
    app.get(/\/gapi\/users\/profiles\/[a-zA-Z0-9]*\/current\/full*/, getUserFull);
}
