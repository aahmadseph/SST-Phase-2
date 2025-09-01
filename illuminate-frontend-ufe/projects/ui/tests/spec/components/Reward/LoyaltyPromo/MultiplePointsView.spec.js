// /* eslint-disable object-curly-newline */
// const React = require('react');
// const { shallow } = require('enzyme');
// const {
//     PROMO_TYPES: { CBR }
// } = require('utils/Promos').default;
// const {
//     ASYNC_PAGE_LOAD,
//     PAGE_DETAIL: { APPLY_POINTS },
//     PAGE_TYPES: { BASKET }
// } = require('analytics/constants').default;

// describe('MultiplePointsView component', () => {
//     let processEvent;
//     let MultiplePointsView;

//     beforeEach(() => {
//         processEvent = require('analytics/processEvent').default;
//         MultiplePointsView = require('components/Reward/LoyaltyPromo/MultiplePointsView/MultiplePointsView').default;
//     });

//     it('should show rewards modal when showModal function is invoked', () => {
//         // Act
//         const showApplyRewardsModalMock = jasmine.createSpy();
//         shallow(<MultiplePointsView showApplyRewardsModal={showApplyRewardsModalMock} />)
//             .dive()
//             .instance()
//             .showModal();

//         // Assert
//         expect(showApplyRewardsModalMock).toHaveBeenCalledWith(true, CBR, undefined, undefined);
//     });

//     it('should show rewards modal and pass isBopis prop when showModal function is invoked', () => {
//         // Act
//         const showApplyRewardsModalMock = jasmine.createSpy();
//         shallow(
//             <MultiplePointsView
//                 isBopis={true}
//                 showApplyRewardsModal={showApplyRewardsModalMock}
//             />
//         )
//             .dive()
//             .instance()
//             .showModal();

//         // Assert
//         expect(showApplyRewardsModalMock).toHaveBeenCalledWith(true, CBR, true, undefined);
//     });

//     it('should trigger analytics when showModal function is invoked', () => {
//         // Arrange
//         const process = spyOn(processEvent, 'process');
//         const eventArgs = {
//             data: {
//                 pageName: `${BASKET}:${APPLY_POINTS}:n/a:*`,
//                 pageType: BASKET,
//                 pageDetail: APPLY_POINTS
//             }
//         };

//         // Act
//         const showApplyRewardsModalMock = jasmine.createSpy();
//         shallow(<MultiplePointsView showApplyRewardsModal={showApplyRewardsModalMock} />)
//             .dive()
//             .instance()
//             .showModal();

//         // Assert
//         expect(process).toHaveBeenCalledWith(ASYNC_PAGE_LOAD, eventArgs);
//     });
// });
