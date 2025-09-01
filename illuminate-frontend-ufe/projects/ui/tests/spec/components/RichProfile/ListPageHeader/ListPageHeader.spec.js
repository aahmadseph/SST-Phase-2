const React = require('react');
const { shallow } = require('enzyme');

describe('ListPageHeader Component', () => {
    const ListPageHeader = require('components/RichProfile/ListPageHeader/ListPageHeader').default;
    const urlUtils = require('utils/Url').default;
    const Location = require('utils/Location').default;

    let component;

    describe('ctrlr', () => {
        it('should not set state if getParamValueAsSingleString does not return rewards', () => {
            const wrapper = shallow(<ListPageHeader />);
            component = wrapper.instance();
            expect(component.state).toEqual({
                previousPageLinkText: null,
                previousPageURL: null
            });
        });

        it('should set state if getParamValueAsSingleString returns rewards', () => {
            spyOn(urlUtils, 'getParamValueAsSingleString').and.returnValue('rewards');
            const wrapper = shallow(<ListPageHeader />);
            component = wrapper.instance();
            expect(component.state).toEqual({
                previousPageLinkText: 'Back to Beauty Insider',
                previousPageURL: '/profile/BeautyInsider'
            });
        });
    });

    describe('goPreviousPage', () => {
        it('should call set location to previous page', () => {
            const setLocationStub = spyOn(Location, 'setLocation');
            spyOn(urlUtils, 'getParamValueAsSingleString').and.returnValue('rewards');
            const wrapper = shallow(<ListPageHeader />);
            component = wrapper.instance();
            component.goPreviousPage();
            expect(setLocationStub).toHaveBeenCalledWith('/profile/BeautyInsider');
        });
    });
});
