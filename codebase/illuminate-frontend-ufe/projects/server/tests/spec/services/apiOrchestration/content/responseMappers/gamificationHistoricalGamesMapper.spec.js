const baseDir = process.cwd();

describe('gamificationHistoricalGamesMapper', () => {
    let GamificationHistoricalGamesMapper;
    let ResponseMapper;
    let gamificationUtils;

    let instance;

    beforeEach((done) => {
        Promise.all([
            import('#server/services/apiOrchestration/content/responseMappers/GamificationHistoricalGamesMapper.mjs'),
            import('#server/services/apiOrchestration/content/responseMappers/ResponseMapper.mjs'),
            import('#server/services/apiOrchestration/content/utils/gamificationUtils.mjs')
        ]).then(function(res) {
            if (res[0]) {
                GamificationHistoricalGamesMapper = res[0].default;
                instance = new GamificationHistoricalGamesMapper();
            }

            if (res[1]) {
                ResponseMapper = res[1].default;
            }

            if (res[2]) {
                gamificationUtils = res[2].default;
            }

            done();
        });
    });

    it('should check that GamificationHistoricalGamesMapper is instance of ResponseMapper', () => {
        expect(instance).toBeInstanceOf(ResponseMapper);
    });

    describe('enhanceComponent', () => {
        const allGames = [{
            gameId: '1',
            promoId: '1'
        }, {
            gameId: '2',
            promoId: '2'
        }, {
            gameId: '3',
            promoId: '3'
        }];
        const apiResults = {
            gamificationSettings: {
                data: {
                    allGames: allGames,
                    fallbackCopyGamesHistory: { text: 'some-value' },
                    fallbackCopyGamesHistoryAnonymous: { text: 'some-value' }
                }
            },
            gamificationGames: {
                history: allGames
            }
        };
        const component = {
            type: 'SectionRendering',
            sid: 'Gamification-HistoricalGames-Section-Dynamic-Binding-Example',
            datasource: {
                type: 'SectionDatasource',
                sid: 'Gamification-HistoryGames-Section-Datasource',
                title: 'Games History'
            }
        };
        const sharedContext = {
            userId: 1
        };
        const fallbackItems = [{
            sid: 'some-sid',
            type: 'Copy',
            content: apiResults.gamificationSettings.data.fallbackCopyGamesHistory
        }];

        beforeEach(() => {
            component.datasource.title = 'Games History';
            apiResults.gamificationGames.history = allGames;
            apiResults.gamificationSettings.data.allGames = allGames;
            apiResults.gamificationSettings.data.allGamesMap = undefined;
            sharedContext.userId = 1;
        });

        it('should process component', () => {
            const gamesCount = 3;

            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(component.items.length).toEqual(gamesCount);
        });

        it('should process component as anonymous user', () => {
            sharedContext.isAnonymous = 'true';

            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(component.datasource.title).toEqual('Games History');
            expect(component.items.length).toEqual(1);
            expect(component.items[0].type).toEqual('Copy');
            expect(component.items[0].sid).toContain('fallbackCopyGamesHistoryAnonymous');
        });

        it('should process component as nonbi user with no history', () => {
            sharedContext.userId = undefined;
            sharedContext.isAnonymous = 'false';
            apiResults.gamificationGames.history = [];

            const createFallbackCopyComponent = spyOn(gamificationUtils, 'createFallbackCopyComponent').and.returnValue(fallbackItems);

            instance.enhanceComponent(component, apiResults, sharedContext);


            expect(createFallbackCopyComponent).toHaveBeenCalled();
            expect(component.datasource.title).toEqual('Games History');
            expect(component.items).toEqual(fallbackItems);
        });

        it('should process component with no history games', () => {
            apiResults.gamificationGames.history = [];

            const createFallbackCopyComponent = spyOn(gamificationUtils, 'createFallbackCopyComponent').and.returnValue(fallbackItems);

            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(createFallbackCopyComponent).toHaveBeenCalled();
            expect(component.datasource.title).toEqual('Games History');
            expect(component.items).toEqual(fallbackItems);
        });

        it('should process component with no games mapped from contentful', () => {
            apiResults.gamificationSettings.data.allGames = [];
            apiResults.gamificationSettings.data.allGamesMap = undefined;

            const createFallbackCopyComponent = spyOn(gamificationUtils, 'createFallbackCopyComponent').and.returnValue(fallbackItems);

            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(createFallbackCopyComponent).toHaveBeenCalled();
            expect(component.datasource.title).toEqual('Games History');
            expect(component.items).toEqual(fallbackItems);
        });

        it('should process component with some games mapped from contentful', () => {
            apiResults.gamificationSettings.data.allGames = allGames.slice(0, 2);
            apiResults.gamificationSettings.data.allGamesMap = undefined;

            const gamesCount = 2;

            instance.enhanceComponent(component, apiResults, sharedContext);

            expect(component.items.length).toEqual(gamesCount);
        });
    });
});
