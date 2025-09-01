// const React = require('react');
// const { shallow } = require('enzyme');
// const { createSpy } = jasmine;
// const FilterChiclets = require('components/Catalog/Filters/FilterChiclets/FilterChiclets').default;

// describe('FilterChiclets', () => {
//     let wrapper;
//     let onClearAllFiltersSpy;
//     let onRemoveChicletSpy;
//     let filters;
//     let refinements;

//     beforeEach(() => {
//         onClearAllFiltersSpy = createSpy();
//         onRemoveChicletSpy = createSpy();
//         filters = {
//             Brand: ['filters[Brand]=bareMinerals'],
//             Concerns: []
//         };
//         refinements = [
//             {
//                 displayName: 'Brand',
//                 type: 'checkboxes',
//                 values: [
//                     {
//                         count: 12,
//                         refinementValue: 'filters[Brand]=Armani Beauty',
//                         refinementValueDisplayName: 'Armani Beauty',
//                         refinementValueStatus: 1
//                     },
//                     {
//                         count: 1,
//                         refinementValue: 'filters[Brand]=bareMinerals',
//                         refinementValueDisplayName: 'bareMinerals',
//                         refinementValueStatus: 1
//                     }
//                 ]
//             }
//         ];

//         wrapper = shallow(
//             <FilterChiclets
//                 isModal={false}
//                 filters={filters}
//                 refinements={refinements}
//                 onRemoveChiclet={onRemoveChicletSpy}
//                 onClearAllFilters={onClearAllFiltersSpy}
//             />
//         );
//     });

//     it('should render ul tag', () => {
//         const elem = wrapper.findWhere(n => n.name() === 'ul');
//         expect(elem.length).toEqual(1);
//     });

//     it('should render Chiclet tag', () => {
//         const elem = wrapper.findWhere(n => n.name() === 'Chiclet');
//         expect(elem.length).toEqual(1);
//     });

//     it('should render Clear All Link', () => {
//         const clearAllLink = wrapper.findWhere(x => x.name() === 'Link' && x.text() === 'Clear all');
//         expect(clearAllLink.exists()).toBeTruthy();
//     });
// });
