/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');
const BottomNav = require('components/Header/BottomNav/BottomNav').default;
const localeUtils = require('utils/LanguageLocale').default;
const userUtils = require('utils/User').default;
const Avatar = require('components/Avatar').default;

xdescribe('BottomNav component', () => {
    let wrapper;
    let addEventListenerStub;

    beforeEach(() => {
        addEventListenerStub = spyOn(window, 'addEventListener');
        wrapper = shallow(<BottomNav />);
    });

    it('should render links in correct order', () => {
        const linkTexts = ['Home', 'Offers'];
        const links = wrapper.find('nav > a span');

        expect(links.length).toEqual(linkTexts.length);
        links.forEach((link, i) => {
            expect(link.text()).toEqual(linkTexts[i]);
        });
    });

    it('should render buttons in correct order', () => {
        const buttonTexts = ['Shop', 'Me', 'Community', 'Stores'];
        const buttons = wrapper.find('nav > button span');
        expect(buttons.length).toEqual(buttonTexts.length);
        buttons.forEach((button, i) => {
            expect(button.text()).toEqual(buttonTexts[i]);
        });
    });

    it('should attach correct onclick handler', () => {
        const states = ['shop', 'me', 'community', 'stores'];
        const buttons = wrapper.find('nav > button');
        buttons.forEach((button, i) => {
            button.simulate('click');
            expect(wrapper.state('active')).toEqual(states[i]);
        });
    });

    describe('Popover component', () => {
        xit('should be displayed above the "Me" section, on first render', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(true);
            spyOn(localeUtils, 'isFrench').and.returnValue(false);
            expect(wrapper.find('Popover').length).toEqual(1);
        });

        it('should not be displayed above the "Me" section, if user is not anonymous', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            expect(wrapper.find('Popover').length).toEqual(0);
        });
    });

    describe('"Me" item', () => {
        const getMeItem = comp => comp.findWhere(n => n.key() === 'meNavItem').first();

        it('should render Avatar', () => {
            expect(getMeItem(wrapper).find(Avatar).length).toEqual(1);
        });

        it('should render "Me" text for anonymus users', () => {
            expect(getMeItem(wrapper).find('span').text()).toEqual('Me');
        });

        it('should render username as user\'s firstname if it is short', () => {
            wrapper.setState({
                user: {
                    firstName: 'Fn',
                    lastName: 'Ln'
                }
            });
            expect(getMeItem(wrapper).find('span').text()).toEqual('Fn');
        });

        it('should render username as user\'s initials if firstname is long', () => {
            wrapper.setState({
                user: {
                    firstName: 'Barabarabara',
                    lastName: 'Ln'
                }
            });
            expect(getMeItem(wrapper).find('span').text()).toEqual('B.L.');
        });
    });
});
