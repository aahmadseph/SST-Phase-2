describe('gamificationActiveGamesMapper', () => {
    const baseDir = process.cwd();
    let GamificationActiveGamesMapper;
    let ResponseMapper;
    let gamificationUtils;

    let instance;

    beforeEach((done) => {
        Promise.all([
            import('#server/services/apiOrchestration/content/responseMappers/GamificationActiveGamesMapper.mjs'),
            import('#server/services/apiOrchestration/content/responseMappers/ResponseMapper.mjs'),
            import('#server/services/apiOrchestration/content/utils/gamificationUtils.mjs')
        ]).then(function(res) {
            if (res[0]) {
                GamificationActiveGamesMapper = res[0].default;
                instance = new GamificationActiveGamesMapper();
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
                    fallbackCopyActiveGames: { text: 'some-value' }
                }
            },
            gamificationGames: {
                active: allGames
            }
        };
        const component = {
            type: 'SectionRendering',
            sid: 'Gamification-ActiveGames-Section-Dynamic-Binding-Example',
            datasource: {
                type: 'SectionDatasource',
                sid: 'Gamification-ActiveGames-Section-Datasource',
                title: 'Active Games'
            }
        };
        const fallbackItems = [{
            sid: 'some-sid',
            type: 'Copy',
            content: apiResults.gamificationSettings.data.fallbackCopyActiveGames,
            style: {
                marginTop: '0',
                marginBottom: '0'
            }
        }];

        beforeEach(() => {
            component.datasource.title = 'Active Games';
            apiResults.gamificationGames.active = allGames;
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

            expect(component.datasource.title).toEqual(`Active Games (${gamesCount})`);
            expect(component.items.length).toEqual(gamesCount);
        });

        it('should process component with no active games', () => {
            apiResults.gamificationGames.active = [];

            const createFallbackCopyComponent = spyOn(gamificationUtils, 'createFallbackCopyComponent').and.returnValue(fallbackItems);

            instance.enhanceComponent(component, apiResults);

            expect(createFallbackCopyComponent).toHaveBeenCalled();
            expect(component.datasource.title).toEqual('Active Games');
            expect(component.items).toEqual(fallbackItems);
        });

        it('should process component with no games mapped from contentful', () => {
            apiResults.gamificationSettings.data.allGames = [];
            apiResults.gamificationSettings.data.allGamesMap = undefined;

            const createFallbackCopyComponent = spyOn(gamificationUtils, 'createFallbackCopyComponent').and.returnValue(fallbackItems);

            instance.enhanceComponent(component, apiResults);

            expect(createFallbackCopyComponent).toHaveBeenCalled();
            expect(component.datasource.title).toEqual('Active Games');
            expect(component.items).toEqual(fallbackItems);
        });

        it('should process component with some games mapped from contentful', () => {
            apiResults.gamificationSettings.data.allGames = allGames.slice(0, 2);
            apiResults.gamificationSettings.data.allGamesMap = undefined;

            const gamesCount = 2;

            instance.enhanceComponent(component, apiResults);

            expect(component.datasource.title).toEqual(`Active Games (${gamesCount})`);
            expect(component.items.length).toEqual(gamesCount);
        });
    });
});
