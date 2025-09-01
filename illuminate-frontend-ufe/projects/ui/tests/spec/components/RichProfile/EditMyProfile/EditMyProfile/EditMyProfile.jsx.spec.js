// describe('<EditMyProfile /> component', () => {
//     let React;
//     let EditMyProfile;
//     let shallowComponent;

//     beforeEach(() => {
//         React = require('react');
//         EditMyProfile = require('components/RichProfile/EditMyProfile/EditMyProfile/EditMyProfile').default;
//     });

//     it('should renders correct links if isLithiumSuccessful is false', () => {
//         shallowComponent = enzyme.mount(
//             <EditMyProfile
//                 linksList={['Photos & Bio', 'Skin', 'Hair', 'Eyes', 'Color IQ', 'Birthday', 'Privacy']}
//                 isLithiumSuccessful={false}
//             />
//         );
//         expect(shallowComponent.find('Flex').length).toEqual(6);
//     });

//     it('should renders correct links if isLithiumSuccessful is true', () => {
//         shallowComponent = enzyme.mount(
//             <EditMyProfile
//                 linksList={['Photos & Bio', 'Skin', 'Hair', 'Eyes', 'Color IQ', 'Birthday', 'Privacy']}
//                 isLithiumSuccessful={true}
//             />
//         );
//         expect(shallowComponent.find('Flex').length).toEqual(7);
//     });
// });
