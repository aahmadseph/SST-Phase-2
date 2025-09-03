const iovation = require('utils/Iovation').default;
const LoadScripts = require('utils/LoadScripts').default;

describe('Iovation utils', () => {
    it('getBlackboxString function should load lovation script', () => {
        // Arrange
        const loadScriptsStub = spyOn(LoadScripts, 'loadScripts').and.returnValue(true);

        // Act
        iovation.loadIovationScript();

        // Assert
        expect(loadScriptsStub).toHaveBeenCalledWith(['//ci-mpsnare.iovation.com/snare.js']);
    });
});
