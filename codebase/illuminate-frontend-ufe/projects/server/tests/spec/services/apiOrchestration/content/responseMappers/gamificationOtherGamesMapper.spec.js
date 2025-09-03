const baseDir = process.cwd();

describe('gamificationOtherActiveGamesMapper', () => {
    let GamificationOtherGamesMapper;
    let ResponseMapper;
    let gamificationUtils;

    let instance;

    beforeEach((done) => {
        Promise.all([
            import('#server/services/apiOrchestration/content/responseMappers/GamificationOtherGamesMapper.mjs'),
            import('#server/services/apiOrchestration/content/responseMappers/ResponseMapper.mjs'),
            import('#server/services/apiOrchestration/content/utils/gamificationUtils.mjs')
        ]).then(function(res) {
            if (res[0]) {
                GamificationOtherGamesMapper = res[0].default;
                instance = new GamificationOtherGamesMapper();
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

    it('should check that target class is instance of ResponseMapper', () => {
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
                    fallbackCopyOtherGames: { text: 'some-value' }
                }
            },
            gamificationGameDetails: {
                otherActiveGames: allGames
            }
        };
        const component = {
            type: 'SectionRendering',
            sid: 'Gamification-OtherGames-Section-Dynamic-Binding-Example',
            datasource: {
                type: 'SectionDatasource',
                sid: 'Gamification-OtherGames-Section-Datasource',
                title: 'Other Games'
            }
        };
        const fallbackItems = [{
            sid: 'some-sid',
            type: 'Copy',
            content: apiResults.gamificationSettings.data.fallbackCopyOtherGames
        }];

        beforeEach(() => {
            component.datasource.title = 'Other Games';
            apiResults.gamificationGameDetails.otherActiveGames = allGames;
            apiResults.gamificationSettings.data.allGames = allGames;
            apiResults.gamificationSettings.data.allGamesMap = undefined;
        });

        it('should call createGameItems', () => {
            const items = [];
            const createGameItems = spyOn(gamificationUtils, 'createGameItems').and.returnValue(items);

            instance.enhanceComponent(component, apiResults);

            expect(createGameItems).toHaveBeenCalled();
        });

        it('should process component', () => {
            const gamesCount = 3;

            instance.enhanceComponent(component, apiResults);

            expect(component.datasource.title).toEqual(`Other Games (${gamesCount})`);
            expect(component.items.length).toEqual(gamesCount);
        });

        it('should process component with no otherActiveGames', () => {
            apiResults.gamificationGameDetails.otherActiveGames = [];

            const createFallbackCopyComponent = spyOn(gamificationUtils, 'createFallbackCopyComponent').and.returnValue(fallbackItems);

            instance.enhanceComponent(component, apiResults);

            expect(createFallbackCopyComponent).toHaveBeenCalled();
            expect(component.datasource.title).toEqual('Other Games');
            expect(component.items).toEqual(fallbackItems);
        });


        it('should process component with no games mapped from contentful', () => {
            apiResults.gamificationSettings.data.allGames = [];
            apiResults.gamificationSettings.data.allGamesMap = undefined;

            const createFallbackCopyComponent = spyOn(gamificationUtils, 'createFallbackCopyComponent').and.returnValue(fallbackItems);

            instance.enhanceComponent(component, apiResults);

            expect(createFallbackCopyComponent).toHaveBeenCalled();
            expect(component.datasource.title).toEqual('Other Games');
            expect(component.items).toEqual(fallbackItems);
        });

        it('should process component with some games mapped from contentful', () => {
            apiResults.gamificationSettings.data.allGames = allGames.slice(0, 2);
            apiResults.gamificationSettings.data.allGamesMap = undefined;

            const gamesCount = 2;

            instance.enhanceComponent(component, apiResults);

            expect(component.datasource.title).toEqual(`Other Games (${gamesCount})`);
            expect(component.items.length).toEqual(gamesCount);
        });
    });
});
