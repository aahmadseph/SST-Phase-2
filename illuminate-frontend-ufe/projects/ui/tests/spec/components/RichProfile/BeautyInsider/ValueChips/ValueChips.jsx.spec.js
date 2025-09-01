const React = require('react');
const { shallow } = require('enzyme');

describe('ValueChips component', () => {
    let localeUtils;
    let ValueChips;
    let shallowComponent;

    beforeEach(() => {
        ValueChips = require('components/RichProfile/BeautyInsider/ValueChips/ValueChips').default;
        localeUtils = require('utils/LanguageLocale').default;
        Sephora.fantasticPlasticConfigurations = {
            isGlobalEnabled: true,
            isMarketingEnabled: true
        };
        shallowComponent = shallow(<ValueChips profileId={0} />);
    });

    it('should show Community popover', () => {
        shallowComponent.setState({ activePopover: 'community' });
        expect(shallowComponent.find('Popover').length).toBe(1);
    });

    it('should set focus on Community popover', () => {
        const component = shallowComponent.instance();
        const focusPopoverSpy = spyOn(component, 'focusPopover');
        const communityLink = shallowComponent.find('Flex').find('Link').at(0);
        communityLink.simulate('click');
        expect(focusPopoverSpy).toHaveBeenCalledWith('community');
    });

    it('should show App popover', () => {
        shallowComponent.setState({ activePopover: 'app' });
        expect(shallowComponent.find('Popover').length).toBe(1);
    });

    it('should set focus on App popover', () => {
        const component = shallowComponent.instance();
        const focusPopoverSpy = spyOn(component, 'focusPopover');
        const appLink = shallowComponent.find('Flex').find('Link').at(1);
        appLink.simulate('click');
        expect(focusPopoverSpy).toHaveBeenCalledWith('app');
    });

    it('should show Card popover', () => {
        spyOn(localeUtils, 'isUS').and.returnValue(false);
        shallowComponent.setState({ activePopover: 'community' });
        expect(shallowComponent.find('Popover').length).toBe(1);
    });

    it('should set focus on Card popover', () => {
        const component = shallowComponent.instance();
        const focusPopoverSpy = spyOn(component, 'focusPopover');
        const cardLink = shallowComponent.find('Flex').find('Link').at(2);
        cardLink.simulate('click');
        expect(focusPopoverSpy).toHaveBeenCalledWith('card');
    });
});
