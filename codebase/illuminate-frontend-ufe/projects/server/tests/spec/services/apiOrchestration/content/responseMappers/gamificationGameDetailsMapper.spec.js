const apiResultsMock = require('./mocks/gameDetailsApiResultsMock.json');
const componentMock = require('./mocks/gameDetailsComponentMock.json');
const baseDir = process.cwd();

describe('gamificationGameDetailsMapper', () => {
    let CHALLENGE_STATUS;
    let GamificationGameDetailsMapper;
    let ResponseMapper;
    let gamificationUtils;

    let instance;

    beforeEach((done) => {
        Promise.all([
            import('#server/services/apiOrchestration/content/constants.mjs'),
            import('#server/services/apiOrchestration/content/responseMappers/GamificationGameDetailsMapper.mjs'),
            import('#server/services/apiOrchestration/content/responseMappers/ResponseMapper.mjs'),
            import('#server/services/apiOrchestration/content/utils/gamificationUtils.mjs')
        ]).then(function(res) {
            if (res[0]) {
                CHALLENGE_STATUS = res[0].CHALLENGE_STATUS;
            }

            if (res[1]) {
                GamificationGameDetailsMapper = res[1].default;
                instance = new GamificationGameDetailsMapper();
            }

            if (res[2]) {
                ResponseMapper = res[2].default;
            }

            if (res[3]) {
                gamificationUtils = res[3].default;
            }

            done();
        });
    });

    it('should check that target class is instance of ResponseMapper', () => {
        expect(instance).toBeInstanceOf(ResponseMapper);
    });

    describe('enhanceComponent', () => {
        let sharedContext = {};
        let apiResults = {};
        let component = {};

        beforeEach(() => {
            sharedContext = { userId: 123 };
            apiResults = { ...apiResultsMock };
            component = { ...componentMock };

            apiResults.gamificationGameDetails.currentGame.gameDetails.endDateTime = '2030-12-22T23:59:00-08:00';
            delete apiResults.gamificationGameDetails.currentGame.unauthorized;
        });

        it('should call parseStatusForAnalytics', () => {
            const items = [];
            const parseStatusForAnalytics = spyOn(gamificationUtils, 'parseStatusForAnalytics').and.returnValue(items);

            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(parseStatusForAnalytics).toHaveBeenCalled();
        });

        it('should call calculateMarketingFlagText', () => {
            const items = [];
            const calculateMarketingFlagText = spyOn(gamificationUtils, 'calculateMarketingFlagText').and.returnValue(items);

            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(calculateMarketingFlagText).toHaveBeenCalled();
        });

        it('should call hasGameEnded', () => {
            const hasGameEnded = spyOn(gamificationUtils, 'hasGameEnded').and.returnValue(false);

            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(hasGameEnded).toHaveBeenCalled();
        });

        it('should return join CTA copy if user anonymous', () => {
            instance.enhanceComponent(component, apiResults, {});
            expect(component.datasource.joinCtaCopy).toEqual(apiResults.gamificationSettings.data.joinCtaCopy);
        });

        it('should not return join CTA copy if user is loggedin', () => {
            instance.enhanceComponent(component, apiResults, sharedContext);
            expect(component.datasource.joinCtaCopy).toBeUndefined();
        });

        it('should show join CTA if gameStatus is NOT_JOINED', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.NOT_JOINED;
            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(component.parameters.showJoinCta).toEqual(true);
            expect(component.datasource.gameDetailsCopy).toBeDefined();
        });

        it('should show redeem points CTA if game status is COMPLETED', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.COMPLETED;
            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(component.parameters.showRedeemPointsCta).toEqual(true);
            expect(component.datasource.redeemPointsCtaLabel).toBeDefined();
            expect(component.datasource.redeemPointsCtaAction).toBeDefined();
        });

        it('should show redeem points CTA if game expired and has points earned', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.OPTED_IN;
            apiResults.gamificationGameDetails.currentGame.gameDetails.endDateTime = '2022-12-22T23:59:00-08:00';
            apiResults.gamificationGameDetails.currentGame.gameDetails.pointsEarned = 100;
            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(component.parameters.showRedeemPointsCta).toEqual(true);
            expect(component.datasource.redeemPointsCtaLabel).toBeDefined();
            expect(component.datasource.redeemPointsCtaAction).toBeDefined();
        });

        it('should not show redeem points CTA if game is not COMPLETED', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.OPTED_IN;
            apiResults.gamificationGameDetails.currentGame.gameDetails.pointsEarned = 0;
            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(component.parameters.showRedeemPointsCta).toEqual(false);
            expect(component.datasource.redeemPointsCtaLabel).not.toBeDefined();
            expect(component.datasource.redeemPointsCtaAction).not.toBeDefined();
        });

        it('should return statusText gameStatusNotJoined if gameStatus is NOT_JOINED', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.NOT_JOINED;
            instance.enhanceComponent(component, apiResults, sharedContext);
            expect(component.datasource.statusText).toEqual(apiResults.gamificationSettings.data.gameStatusNotJoined);
        });

        it('should return statusText gameStatusJoined if gameStatus is OPTED_IN with points earned undefined', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.OPTED_IN;
            apiResults.gamificationGameDetails.currentGame.gameDetails.pointsEarned = undefined;
            instance.enhanceComponent(component, apiResults, sharedContext);
            expect(component.datasource.statusText).toEqual(apiResults.gamificationSettings.data.gameStatusJoined);
        });


        it('should return statusText gameStatusPending if gameStatus is OPTED_IN with 0 points earned', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.OPTED_IN;
            apiResults.gamificationGameDetails.currentGame.gameDetails.pointsEarned = 0;
            instance.enhanceComponent(component, apiResults, sharedContext);
            expect(component.datasource.statusText).toEqual(apiResults.gamificationSettings.data.gameStatusPending);
        });

        it('should return statusText gameStatusEarned if gameStatus is OPTED_IN with 500 points earned', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.OPTED_IN;
            apiResults.gamificationGameDetails.currentGame.gameDetails.pointsEarned = 500;
            instance.enhanceComponent(component, apiResults, sharedContext);
            expect(component.datasource.statusText).toEqual(apiResults.gamificationSettings.data.gameStatusEarned?.replace('{0}', apiResults.gamificationGameDetails.currentGame.gameDetails.pointsEarned));
        });

        it('should return statusText gameStatusCompleted if gameStatus is COMPLETED', () => {
            apiResults.gamificationGameDetails.currentGame.gameDetails.gameStatus = CHALLENGE_STATUS.COMPLETED;
            instance.enhanceComponent(component, apiResults, sharedContext);
            expect(component.datasource.statusText).toEqual(apiResults.gamificationSettings.data.gameStatusCompleted?.replace('{0}', apiResults.gamificationGameDetails.currentGame.gameDetails.pointsEarned));
        });

        it('should process component', () => {
            instance.enhanceComponent(component, apiResults, sharedContext);
            expect(component.datasource).toBeDefined();
            expect(component.parameters).toBeDefined();
            expect(component.datasource.sid).toEqual('Gamificatoin-GameDetails-Ready-Set-Sephora-GameDetailsDatasource');
            expect(component.datasource.tasks.length).toBeGreaterThan(0);
        });

        it('should return fallbackCopy when component in unauthorized', () => {
            apiResults.gamificationGameDetails.currentGame.unauthorized = true;

            const enhancedComponent = instance.enhanceComponent(component, apiResults, sharedContext);
            expect(enhancedComponent).toBeDefined();
            expect(enhancedComponent.sid).toEqual('Gamification-Unauthorized-Copy');
            expect(enhancedComponent.type).toEqual('Copy');
            expect(enhancedComponent.content).toEqual(apiResults.gamificationSettings.data.fallbackCopySoftLaunch);
            expect(component).toEqual(component);
        });

        it('should throw error if no game or game tasks', () => {
            component = { sid: 'no-game' };
            expect(() => instance.enhanceComponent(component, apiResults, sharedContext)).toThrowError(`GamificationGameDetailsMapper hasn't found any GamificationGame in featuresData for ${component.sid}, or tasks empty.`);
        });

        it('should throw error if no gamification settings', () => {
            apiResults.gamificationSettings = undefined;
            expect(() => instance.enhanceComponent(component, apiResults, sharedContext)).toThrowError(`GamificationGameDetailsMapper hasn't found any GamificationSettings data for ${component.sid}`);
        });

        it('should throw error if no game details or game task details', () => {
            // NOTE: Some how the beforeEach() is not resetting the values when we set gameDetails to undefined, this it() must stay at the bottom of the file.
            apiResults.gamificationGameDetails.currentGame.gameDetails = undefined;
            expect(() => instance.enhanceComponent(component, apiResults, sharedContext)).toThrowError(`GamificationGameDetailsMapper hasn't found any currentGame.gameDetails and/or currentGame.tasks for ${component.sid}`);
        });
    });
});
