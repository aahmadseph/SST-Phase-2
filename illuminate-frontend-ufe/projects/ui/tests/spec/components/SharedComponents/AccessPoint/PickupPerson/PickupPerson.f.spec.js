const React = require('react');
const { shallow } = require('enzyme');

const PickupPerson = require('components/SharedComponents/AccessPoint/PickupPerson/PickupPerson').default;
const { getLocaleResourceFile } = require('utils/LanguageLocale').default;
const getText = getLocaleResourceFile('components/SharedComponents/AccessPoint/PickupPerson/locales', 'PickupPerson');

describe('PickupPerson component', () => {
    let wrapper;
    let props;

    describe('PickupPerson [Logged In Order]', () => {
        beforeEach(() => {
            props = {
                firstName: 'Jhon',
                lastName: 'Doe'
            };
            wrapper = shallow(<PickupPerson {...props} />);
        });

        it('should be rendered', () => {
            expect(wrapper.isEmptyRender()).toBeFalsy();
        });

        it('should have a title "Pickup Person"', () => {
            const title = wrapper.findWhere(n => n.name() === 'Text' && n.contains(getText('pickupPerson')));
            expect(title).toBeTruthy();
        });

        it('firstName should say "Jhon"', () => {
            const firstName = wrapper.findWhere(n => n.name() === 'Text' && n.contains('Jhon'));
            expect(firstName).toBeTruthy();
        });

        it('lastName should say "Doe"', () => {
            const lastName = wrapper.findWhere(n => n.name() === 'Text' && n.contains('Doe'));
            expect(lastName).toBeTruthy();
        });

        it('isOrderDetails prop should be false by default', () => {
            expect(wrapper.props().isOrderDetail).toBeFalsy();
        });

        it('should display a Box with texts pleaseHaveYour, photoId and addedInstructions', () => {
            const pleaseHaveYour = wrapper.findWhere(n => n.name() === 'Box' && n.contains(getText('pleaseHaveYour')));
            const photoId = wrapper.findWhere(n => n.name() === 'Box' && n.contains(getText('photoId')));
            const addedInstructions = wrapper.findWhere(n => n.name() === 'Box' && n.contains(getText('addedInstructions')));
            expect(pleaseHaveYour).toBeTruthy();
            expect(photoId).toBeTruthy();
            expect(addedInstructions).toBeTruthy();
        });
    });

    describe('PickupPerson [with Guest Order params]', () => {
        beforeEach(() => {
            props = {
                firstName: 'Jhon',
                lastName: 'Doe',
                email: 'jhon.doe@lol.com',
                isOrderDetail: false,
                isGuestOrder: false
            };
        });

        it('email should not display with [isGuestOrder=false]', () => {
            wrapper = shallow(<PickupPerson {...props} />);
            const email = wrapper.findWhere(n => n.name() === 'Text' && n.contains('jhon.doe@lol.com'));
            expect(email.isEmptyRender()).toBeTruthy();
        });

        it('email should only display with [isOrderDetail=false && isGuestOrder=true] and say "jhon.doe@lol.com"', () => {
            wrapper = shallow(
                <PickupPerson
                    {...props}
                    isGuestOrder
                />
            );
            const email = wrapper.findWhere(n => n.name() === 'Text' && n.contains('jhon.doe@lol.com'));
            expect(email).toBeTruthy();
        });
    });
});
