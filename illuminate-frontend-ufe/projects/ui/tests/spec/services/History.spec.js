describe('History service', () => {
    let HistoryService;

    beforeEach(() => {
        HistoryService = require('services/History').default;
    });

    describe('#normalizeLocation', () => {
        it('should ensure that the PATH returned starts with a single slash', () => {
            expect(HistoryService.normalizeLocation({ path: 'no-slash' }).path).toEqual('/no-slash');
            expect(HistoryService.normalizeLocation({ path: '/one-slash' }).path).toEqual('/one-slash');
            expect(HistoryService.normalizeLocation({ path: '///multiple-slashes' }).path).toEqual('/multiple-slashes');
        });

        it(
            'should ensure that the PATH returned equals to the actual ' + 'window.location one if path prop is omitted on the passed location',
            function () {
                expect(HistoryService.normalizeLocation({}).path).toEqual(window.location.pathname);
            }
        );

        it('should ensure that the ANCHOR returned has the hash sign when it is needed', function () {
            expect(HistoryService.normalizeLocation({ anchor: '' }).anchor).toEqual('');
            expect(HistoryService.normalizeLocation({ anchor: null }).anchor).toEqual(window.location.hash);
            expect(HistoryService.normalizeLocation({ anchor: '###multiple-hashes' }).anchor).toEqual('###multiple-hashes');
            expect(HistoryService.normalizeLocation({ anchor: '#one-hash' }).anchor).toEqual('#one-hash');
            expect(HistoryService.normalizeLocation({ anchor: 'no-hash' }).anchor).toEqual('#no-hash');
        });

        it(
            'should ensure that the ANCHOR returned equals to the actual ' + 'window.location one if anchor prop is omitted on the passed location',
            function () {
                expect(HistoryService.normalizeLocation({}).anchor).toEqual(window.location.hash);
            }
        );

        it('should ensure that the QUERYPARAMS returned always have their ' + 'values of type array', function () {
            expect(HistoryService.normalizeLocation({ queryParams: { a: 1 } }).queryParams).toEqual({ a: ['1'] });
            expect(HistoryService.normalizeLocation({ queryParams: { a: [1] } }).queryParams).toEqual({ a: [1] });
        });

        it('should filter out props with undefined values from the QUERYPARAMS', function () {
            expect(
                HistoryService.normalizeLocation({
                    queryParams: {
                        a: 'b',
                        b: undefined
                    }
                }).queryParams
            ).toEqual({ a: ['b'] });
        });

        it('should ensure that the result is the object always consisting ' + 'of only { path, queryString, anchor } properties', function () {
            expect(
                HistoryService.normalizeLocation({
                    a: 1,
                    b: 2,
                    c: 3,
                    path: '/some-path',
                    queryParams: { z: [26] },
                    anchor: '#123'
                })
            ).toEqual({
                path: '/some-path',
                queryParams: { z: [26] },
                anchor: '#123',
                prevPath: window.location.pathname
            });
        });
    });

    describe('loadSpa function', () => {
        let mockOpenOrUpdatePage;
        let originalLoadSpa;
        let store;

        beforeEach(() => {
            // Save original implementation
            originalLoadSpa = HistoryService.loadSpa;

            // Create mock for action creator and store
            mockOpenOrUpdatePage = jasmine.createSpy('openOrUpdatePage').and.returnValue({});
            store = { dispatch: jasmine.createSpy('dispatch') };

            // Set up the service with mocks
            HistoryService.store = store;
            HistoryService.navigationTriggeredByUser = false;

            // Replace loadSpa with a mock version that uses our mocks
            HistoryService.loadSpa = function (newLocation, previousLocation) {
                const shouldScrollPageToTop = HistoryService.navigationTriggeredByUser;
                const action = mockOpenOrUpdatePage(newLocation, previousLocation, shouldScrollPageToTop);
                store.dispatch(action);

                return Promise.resolve();
            };
        });

        afterEach(() => {
            // Restore original implementation
            HistoryService.loadSpa = originalLoadSpa;
        });

        it('should invoke action creator function "openOrUpdatePage" with correct arguments', done => {
            // Arrange
            const newLocation = 'argumentOne';
            const previousLocation = 'argumentTwo';
            const shouldScrollPageToTop = false;

            // Act
            HistoryService.loadSpa(newLocation, previousLocation).then(() => {
                // Assert
                expect(mockOpenOrUpdatePage).toHaveBeenCalledWith(newLocation, previousLocation, shouldScrollPageToTop);
                done();
            });
        });

        it('should dispatch openPage action', done => {
            // Arrange
            const actionObject = { type: 'TEST_ACTION' };
            mockOpenOrUpdatePage.and.returnValue(actionObject);

            // Act
            HistoryService.loadSpa().then(() => {
                // Assert
                expect(store.dispatch).toHaveBeenCalledWith(actionObject);
                done();
            });
        });
    });
});
