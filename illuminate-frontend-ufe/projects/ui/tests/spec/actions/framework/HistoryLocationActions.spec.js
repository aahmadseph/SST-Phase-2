describe('HistoryLocationActions', function () {
    let HistoryLocationActions;
    let historyService;

    beforeEach(() => {
        HistoryLocationActions = require('actions/framework/HistoryLocationActions').default;
        historyService = require('services/History').default;
    });

    describe('#goTo', function () {
        let pushToLocationSpy;
        beforeEach(function () {
            pushToLocationSpy = spyOn(historyService, 'pushToLocation');
            spyOn(historyService, 'normalizeLocation').and.callFake(args => {
                if (args === 'New York') {
                    return 'Manhattan';
                } else {
                    return '';
                }
            });
        });

        it('should push history state to the normalized location', function () {
            HistoryLocationActions.goTo('New York');
            expect(pushToLocationSpy).toHaveBeenCalledWith('Manhattan');
        });

        it('should return correct action object', function () {
            const result = HistoryLocationActions.goTo('New York');
            expect(result).toEqual({
                type: 'update-current-location',
                location: 'Manhattan'
            });
        });
    });

    describe('#replaceState', function () {
        let replaceLocationServiceSpy;
        beforeEach(function () {
            replaceLocationServiceSpy = spyOn(historyService, 'replaceLocation');
            spyOn(historyService, 'normalizeLocation').and.callFake(args => {
                if (args === 'San Francisco') {
                    return 'Alcatraz';
                } else {
                    return '';
                }
            });
        });

        it('should replace history state to the normalized location', function () {
            HistoryLocationActions.replaceLocation('San Francisco');
            expect(replaceLocationServiceSpy).toHaveBeenCalledWith('Alcatraz');
        });

        it('should return correct action object', function () {
            const result = HistoryLocationActions.replaceLocation('San Francisco');
            expect(result).toEqual({
                type: 'update-current-location',
                location: 'Alcatraz'
            });
        });
    });
});
