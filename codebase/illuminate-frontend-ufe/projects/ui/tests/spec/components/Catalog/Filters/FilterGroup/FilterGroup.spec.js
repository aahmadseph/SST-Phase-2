const React = require('react');
const { shallow } = require('enzyme');
const { any } = jasmine;
const FilterGroup = require('components/Catalog/Filters/FilterGroup/FilterGroup').default;
const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
const getText = getLocaleResourceFile('components/Catalog/Filters/locales', 'Filters');

describe('FilterGroup component', () => {
    let props;
    let wrapper;

    beforeEach(() => {
        props = {
            title: 'Brand',
            type: 'checkboxes',
            selectedValues: [],
            values: []
        };

        wrapper = shallow(<FilterGroup {...props} />);
    });

    // it('should render the title coming in props', () => {
    //     const titleText = wrapper.findWhere(n => n.name() === 'Text' && n.props().children === props.title);

    //     expect(titleText.length).toEqual(1);
    // });

    it('should open the section when Filter Group title clicked', () => {
        const setStateStub = spyOn(wrapper.instance(), 'setState');

        const buttonComp = wrapper.findWhere(n => n.name() === 'Link');

        buttonComp.simulate('click');

        expect(setStateStub).toHaveBeenCalledWith({ expandedByUser: true });
    });

    it('should not render search input if more has 10 or less values', () => {
        const searchInput = wrapper.findWhere(x => x.name() === 'TextInput' && x.prop('type') === 'search');

        expect(searchInput.exists()).toBeFalsy();
    });

    describe('search', () => {
        beforeEach(() => {
            const values = [];

            for (let i = 1; i <= 11; i++) {
                const value = {
                    refinementValueStatus: 0,
                    refinementValue: `value ${i}`,
                    refinementValueDisplayName: `name ${i}`
                };
                values.push(value);
            }

            props.values = values;
            wrapper.setProps(props);
            spyOn(wrapper.instance(), 'isExpanded').and.returnValue(true);
        });

        it('should be rendered if FilterGroup has more than 10 values', () => {
            const searchInput = wrapper.findWhere(x => x.name() === 'TextInput' && x.prop('type') === 'search');

            expect(searchInput.exists()).toBeTruthy();
        });

        it('should not hide show more if less than 2 characters entered', () => {
            const showMore = wrapper.findWhere(x => x.name() === 'Link' && x.props().children === getText('showMore'));

            expect(showMore.exists()).toBeTruthy();
        });

        it('should hide show more if 2 and more characters entered', () => {
            wrapper.setState({ searchTerm: 'ar' });

            const showMore = wrapper.findWhere(x => x.name() === 'Link' && x.props().children === getText('showMore'));

            expect(showMore.exists()).toBeFalsy();
        });

        it('should filter appropriate options by searchTerm applied', () => {
            wrapper.setState({
                searchTerm: 'name 1',
                displayByAtoZ: true
            });

            const filterItems = wrapper.findWhere(x => x.name() === 'FilterItem');

            // 'name 1', 'name 10' and 'name 11' found by 'name 1'
            expect(filterItems.length).toBe(3);
        });

        it('should not render no results if any option found', () => {
            wrapper.setState({
                searchTerm: 'name 1',
                displayByAtoZ: true
            });

            const noResultsText = wrapper.findWhere(x => x.name() === 'Text' && x.props().children[0] === `${getText('noResults')}.`);

            expect(noResultsText.exists()).toBeFalsy();
        });

        it('should render no results text if no any option found', () => {
            wrapper.setState({ searchTerm: 'notAnOptionName' });

            const noResultsText = wrapper.findWhere(x => x.name() === 'Text' && x.props().children[0] === `${getText('noResults')}.`);

            expect(noResultsText.exists()).toBeTruthy();
        });

        it('should not render clear link if any option found', () => {
            wrapper.setState({
                searchTerm: 'name 1',
                displayByAtoZ: true
            });

            const clearLink = wrapper.findWhere(x => x.name() === 'Link' && x.props().children === getText('clear'));

            expect(clearLink.exists()).toBeFalsy();
        });

        it('should render clear link if no any option found', () => {
            wrapper.setState({ searchTerm: 'notAnOptionName' });

            const clearLink = wrapper.findWhere(x => x.name() === 'Link' && x.props().children === getText('clear'));

            expect(clearLink.exists()).toBeTruthy();
        });

        it('should resset searchTerm on clearLink click', () => {
            wrapper.setState({ searchTerm: 'notAnOptionName' });
            const setStateSpy = spyOn(wrapper.instance(), 'setState');

            const clearLink = wrapper.findWhere(x => x.name() === 'Link' && x.props().children === getText('clear'));

            clearLink.simulate('click');

            expect(setStateSpy).toHaveBeenCalledWith({ searchTerm: '' }, any(Function));
        });
    });
});
