describe('FilterItem component', () => {
    let React;
    let shallow;
    let FilterItem;
    let props;
    let wrapper;

    beforeEach(() => {
        React = require('react');
        shallow = enzyme.shallow;
        FilterItem = require('components/Catalog/Filters/FilterItem/FilterItem').default;
    });

    describe('singleSelect', () => {
        it('should be rendered for Price Range', () => {
            props = {
                title: 'Price Range',
                type: 'range',
                value: {
                    refinementValue: 'pl=min&ph=25',
                    refinementValueDisplayName: 'Under $25',
                    refinementValueStatus: 1
                }
            };
            wrapper = shallow(<FilterItem {...props} />);
            const compType = wrapper.findWhere(n => n.name() === 'SingleSelect' && n.text() === '<SingleSelect />');

            expect(compType.length).toEqual(1);
        });

        it('should be rendered for Rating', () => {
            props = {
                title: 'Rating',
                type: 'radios',
                value: {
                    count: 757,
                    refinementValue: 'filters[Rating]=\'3\'-\'inf\'',
                    refinementValueDisplayName: '3 and up',
                    refinementValueStatus: 1
                }
            };

            wrapper = shallow(<FilterItem {...props} />);
            const compType = wrapper.findWhere(n => n.name() === 'SingleSelect' && n.text() === '<SingleSelect />');

            expect(compType.length).toEqual(1);
        });
    });

    describe('multiSelect', () => {
        it('should be rendered for Brand', () => {
            props = {
                title: 'Brand',
                type: 'checkboxes',
                value: {
                    count: 1,
                    refinementValue: 'filters[Brand]=AERIN',
                    refinementValueDisplayName: 'AERIN',
                    refinementValueStatus: 1
                }
            };

            wrapper = shallow(<FilterItem {...props} />);
            const compType = wrapper.findWhere(n => n.name() === 'MultiSelect' && n.text() === '<MultiSelect />');

            expect(compType.length).toEqual(1);
        });

        it('should be rendered for Skin Type', () => {
            props = {
                title: 'Skin Type',
                type: 'checkboxes',
                value: {
                    count: 1158,
                    refinementValue: 'filters[Skin Type]=Normal',
                    refinementValueDisplayName: 'Normal',
                    refinementValueStatus: 1
                }
            };

            wrapper = shallow(<FilterItem {...props} />);
            const compType = wrapper.findWhere(n => n.name() === 'MultiSelect' && n.text() === '<MultiSelect />');

            expect(compType.length).toEqual(1);
        });
    });
});
