/* eslint-disable object-curly-newline */
let apiUtil;
let BazaarVoice;
let Location;

describe('BazaarVoiceQandA Service', () => {
    const { objectContaining } = jasmine;
    const bvHost = 'someHost';
    const bvToken = 'someToken';
    const bvVersion = 'someVersion';
    const bvWriteVersion = 'someWriteVersion';
    let apiRequestStub;
    let fakePromise;
    let requestArgs;

    beforeEach(() => {
        Location = require('utils/Location').default;
        spyOn(Location, 'isRichProfilePage').and.returnValue(true);
        Sephora.configurationSettings.isBazaarVoiceEnabled = true;

        Sephora.configurationSettings['bvApi_rich_profile'] = {
            host: bvHost,
            token: bvToken,
            version: bvVersion
        };

        Sephora.configurationSettings['bvApi_rwdQandA_write'] = {
            host: bvHost,
            token: bvToken,
            version: bvWriteVersion
        };

        apiUtil = require('utils/Api').default;
        BazaarVoice = require('services/api/thirdparty/BazaarVoiceQandA').default;

        fakePromise = {
            then: () => {
                return fakePromise;
            },
            catch: () => {
                return () => {};
            }
        };
    });

    describe('get questions and stats', () => {
        const productId = '123456';

        beforeEach(() => {
            apiRequestStub = spyOn(apiUtil, 'request').and.resolveTo({ json: () => ({ Results: [] }) });
        });

        describe('Filter querystring param productId value', () => {
            it('should equal the productId', async function () {
                await BazaarVoice.QuestionAnswersandStats(productId);

                expect(apiRequestStub).toHaveBeenCalledWith(
                    objectContaining({
                        qsParams: objectContaining({
                            Filter: `ProductId:${productId}`
                        })
                    })
                );
            });

            it('should Filter based on sort', async function () {
                await BazaarVoice.QuestionAnswersandStats(productId, 10, 'SubmissionTime:desc');

                expect(apiRequestStub).toHaveBeenCalledWith(
                    objectContaining({
                        qsParams: objectContaining({
                            Filter: `ProductId:${productId}`,
                            Sort: 'SubmissionTime:desc'
                        })
                    })
                );
            });
        });
    });

    describe('submit Vote', () => {
        beforeEach(() => {
            apiRequestStub = spyOn(apiUtil, 'request').and.returnValue(fakePromise);

            BazaarVoice.submitFeedback('Answer', '123', true);

            requestArgs = apiRequestStub.calls.first().args[0];
        });

        it('submit a request with a method of POST', () => {
            expect(requestArgs.method).toEqual('POST');
        });

        it('submit a request with a base url of https://{bvHost}/data/submitfeedback.json', () => {
            const url = `https://${bvHost}/data/submitfeedback.json`;
            expect(requestArgs.url.startsWith(url)).toBeTruthy();
        });

        it('submit a request with product id in the body', () => {
            expect(requestArgs.qsParams).toEqual(
                objectContaining({
                    FeedbackType: 'helpfulness',
                    ContentType: 'Answer',
                    ContentId: '123',
                    Vote: 'Positive',
                    apiversion: bvWriteVersion,
                    Locale: 'en_US'
                })
            );
        });
    });
});
