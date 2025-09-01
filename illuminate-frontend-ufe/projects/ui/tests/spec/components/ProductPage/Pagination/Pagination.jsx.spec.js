// const React = require('react');
// const { shallow } = require('enzyme');
// const Pagination = require('components/ProductPage/Pagination/Pagination').default;

// describe('Pagination component', () => {
//     it('should return null if there are not reviews', () => {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={0}
//                 currentPage={1}
//             />
//         );
//         expect(shallowedComponent.find('Flex').length).toBe(0);
//     });

//     it('should return null if there is only one page', () => {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={1}
//                 currentPage={1}
//             />
//         );
//         expect(shallowedComponent.find('Flex').length).toBe(0);
//     });

//     it('should display all the page buttons if pages number is lower than 8', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={7}
//                 currentPage={1}
//             />
//         );
//         // It will be 9, since it counts back and forward
//         expect(shallowedComponent.find('button').length).toBe(9);
//     });

//     it('should display all the page buttons if pages number is higher than 9', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={11}
//                 currentPage={8}
//             />
//         );
//         // It will be 9, since it counts back and forward buttons
//         expect(shallowedComponent.find('button').length).toBe(8);
//     });

//     it('should render the Previous button', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={11}
//                 currentPage={8}
//             />
//         );
//         expect(shallowedComponent.findWhere(n => n.name() === 'button' && n.prop('aria-label') === 'Previous page').length).toBe(1);
//     });

//     it('should render the Next button', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={11}
//                 currentPage={8}
//             />
//         );
//         expect(shallowedComponent.findWhere(n => n.name() === 'button' && n.prop('aria-label') === 'Next page').length).toBe(1);
//     });

//     it('should display ellipsis button if pages number is higher than 7', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={8}
//                 currentPage={1}
//             />
//         );
//         expect(shallowedComponent.findWhere(n => n.prop('children') === '...').length).toBe(1);
//     });

//     it('should display ellipsis buttons if pages number is higher than 8 and its on the 4th page (or higher)', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={10}
//                 currentPage={5}
//             />
//         );
//         expect(shallowedComponent.findWhere(n => n.prop('children') === '...').length).toBe(2);
//     });

//     it('should disable back button when current page is first page', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={2}
//                 currentPage={1}
//             />
//         );
//         expect(shallowedComponent.findWhere(n => n.prop('disabled') === true).length).toBe(1);
//     });

//     it('should disable forward button when current page is last page', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={3}
//                 currentPage={3}
//             />
//         );
//         expect(shallowedComponent.findWhere(n => n.prop('disabled') === true).length).toBe(1);
//     });

//     it('should not disabled buttons when current page either first page or last page', function () {
//         const shallowedComponent = shallow(
//             <Pagination
//                 totalPages={3}
//                 currentPage={2}
//             />
//         );
//         expect(shallowedComponent.findWhere(n => n.prop('disabled') === true).length).toBe(0);
//     });
// });
