const { any } = jasmine;
const playerUtils = require('services/api/thirdparty/Player').default;
const loader = require('utils/LoadScripts').default;

describe('Player utils', () => {
    beforeEach(() => {
        global.videojs = {
            getPlayers: () => {},
            getPlayer: () => {}
        };
    });

    describe('getByVideoId', () => {
        let videoId;
        let loadScriptsStub;
        let getPlayerStub;

        beforeEach(() => {
            videoId = 'videoId';
            loadScriptsStub = spyOn(loader, 'loadScripts').and.callFake((...args) => {
                args[1]();
            });
            getPlayerStub = spyOn(global.videojs, 'getPlayer');
        });

        it('should load script for the player', done => {
            // Act
            playerUtils.getByVideoId(videoId).catch(() => {
                done();
            });

            // Assert
            expect(loadScriptsStub).toHaveBeenCalledWith([playerUtils.PLAYER_URL], any(Function));
        });

        it('should not try to get player if it\'s not available', done => {
            // Act
            playerUtils.getByVideoId(videoId).catch(() => {
                done();
            });

            // Assert
            expect(getPlayerStub).not.toHaveBeenCalled();
        });

        it('should get player if it\'s ready', done => {
            // Arrange
            spyOn(global.videojs, 'getPlayers').and.returnValue({ videoId: {} });

            // Act
            playerUtils.getByVideoId(videoId).then(() => {
                done();
            });

            // Assert
            expect(getPlayerStub).toHaveBeenCalledWith('videoId');
        });
    });
});
