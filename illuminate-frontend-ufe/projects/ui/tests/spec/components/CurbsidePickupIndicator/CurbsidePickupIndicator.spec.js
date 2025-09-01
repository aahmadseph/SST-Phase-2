const React = require('react');
const { shallow } = require('enzyme');
const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
const getText = getLocaleResourceFile('components/CurbsidePickupIndicator/locales', 'CurbsidePickupIndicator');

const customProps = {
    children: 'Custom text'
};

let CurbsidePickupIndicator;
let wrapper;

describe('Test CurbsidePickupIndicator', () => {
    beforeEach(() => {
        CurbsidePickupIndicator = require('components/CurbsidePickupIndicator').default;
        wrapper = shallow(<CurbsidePickupIndicator />);
    });

    it('component should render', () => {
        expect(wrapper.isEmptyRender()).toBeFalsy();
    });

    it('component should render with default icon', () => {
        const icon = wrapper.find('Icon[name="checkmark"]');
        expect(icon.length).toEqual(1);
    });

    it('component should render with default icon color', () => {
        const icon = wrapper.find('Icon[color="green"]');
        expect(icon.length).toEqual(1);
    });

    it('component should render with default text message', () => {
        const textWrapper = wrapper.findWhere(n => n.key() === 'textWrapper' && n.prop('children') === getText('curbsidePickupAvailable'));

        expect(textWrapper.length).toEqual(1);
    });

    it('component should render with custom text message', () => {
        wrapper.setProps(customProps);

        const textWrapper = wrapper.findWhere(n => n.key() === 'textWrapper' && n.prop('children') === customProps.children);

        expect(textWrapper.length).toEqual(1);
    });
});
