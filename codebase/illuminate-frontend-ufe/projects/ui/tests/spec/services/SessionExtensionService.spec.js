// const { clock } = jasmine;

// describe('Session Extension', () => {
//     let sessionExtensionService;
//     let ufeApi;
//     let store;
//     let clearIntervalStub;
//     let getCallsCounterStub;
//     let dispatchStub;

//     beforeEach(() => {
//         clock().install();
//         store = require('Store').default;
//         dispatchStub = spyOn(store, 'dispatch');

//         ufeApi = require('services/api/ufeApi').default;
//         getCallsCounterStub = spyOn(ufeApi, 'getCallsCounter').and.callThrough();

//         const klarnaUtils = require('utils/Klarna').default;
//         spyOn(klarnaUtils, 'extendSessionInBackground').and.returnValue(false);

//         sessionExtensionService = require('services/SessionExtensionService').default;
//         clearIntervalStub = spyOn(window, 'clearInterval');
//     });

//     afterEach(() => {
//         clock().uninstall();
//     });

//     it('Should decrease expiry time', () => {
//         // Arrange
//         const EXPIRY = 900000;

//         // Act
//         sessionExtensionService.setExpiryTimer(0);
//         clock().tick(2000);

//         // Assert
//         expect(sessionExtensionService.expiry).toBeLessThan(EXPIRY);
//     });

//     it('Should reset ExpiryTimer', () => {
//         // Arrange
//         getCallsCounterStub.and.callFake(() => 1);

//         // Act
//         sessionExtensionService.setExpiryTimer(0);
//         clock().tick(1005);

//         // Assert
//         expect(clearIntervalStub).toHaveBeenCalled();
//     });

//     it('Should dispatch modal ', () => {
//         // Arrange/Act
//         sessionExtensionService.setExpiryTimer(0);
//         clock().tick(870000);

//         // Assert
//         expect(dispatchStub).toHaveBeenCalled();
//     });
// });
