// const React = require('react');
// const { objectContaining } = jasmine;
// const { shallow } = require('enzyme');
// const ChatLink = require('components/SmartChat/ChatLink/ChatLink').default;
// const analyticsUtils = require('analytics/utils').default;

// describe('ChatLink component', () => {
//     it('should set eVar64 for s.t call on the next pageload event', () => {
//         // Arrange
//         const navigationInfo = 'toolbar nav:customer service chat:customer service chat:customer service chat:customer service chat';

//         // Act
//         shallow(<ChatLink />).simulate('click');

//         // Assert
//         const previousPageData = analyticsUtils.getPreviousPageData();
//         expect(previousPageData).toEqual(objectContaining({ navigationInfo }));
//     });
// });
