import { http, HttpResponse } from 'msw';

const backInStockSmsOptIn = http.post('/api/util/skus/notify', (_req, _res, _ctx) => {
    return HttpResponse.json({
        dataFieldOne: 1,
        dataFieldTwo: 'dataFieldTwo'
    });
});

export default backInStockSmsOptIn;
