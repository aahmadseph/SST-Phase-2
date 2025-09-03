const React = require('react');
const { shallow } = require('enzyme');

describe('PickUpOrderContactInfo component', () => {
    let wrapper;
    let PickUpOrderContactInfo;
    let props;

    beforeEach(() => {
        props = {
            firstname: 'test',
            lastName: 'user',
            email: 'testuser@email.com'
        };
        PickUpOrderContactInfo = require('components/Checkout/Sections/PickUpOrderContactInfo/Display/PickUpOrderContactInfo').default;
        wrapper = shallow(<PickUpOrderContactInfo {...props} />);
    });

    describe('personal info section', () => {
        it('should render data attribute', () => {
            wrapper = shallow(<PickUpOrderContactInfo {...props} />);

            const personalInfo = wrapper.findWhere(x => x.name() === 'div' && x.prop('data-at') === 'personal_info');

            expect(personalInfo.length).toEqual(1);
        });
        it('should render first and last name', () => {
            wrapper = shallow(<PickUpOrderContactInfo {...props} />);

            const firstAndLastName = wrapper.findWhere(
                x => x.name() === 'div' && x.prop('data-at') === 'personal_info' && x.prop('children').indexOf('test user') !== -1
            );

            expect(firstAndLastName.length).toEqual(1);
        });
        it('should render email', () => {
            wrapper = shallow(<PickUpOrderContactInfo {...props} />);

            const email = wrapper.findWhere(
                x => x.name() === 'div' && x.prop('data-at') === 'personal_info' && x.prop('children').indexOf('testuser@email.com') !== -1
            );

            expect(email.length).toEqual(1);
        });
    });
    describe('alternate pickup person section', () => {
        it('should render AlternatePickup component if true in props', () => {
            props.isAltPickupPersonEnabled = true;
            wrapper = shallow(<PickUpOrderContactInfo {...props} />);

            const AlternatePickup = wrapper.find('AlternatePickup');

            expect(AlternatePickup.length).toEqual(1);
        });
        it('should not render AlternatePickup component if false in props', () => {
            props.isAltPickupPersonEnabled = false;
            wrapper = shallow(<PickUpOrderContactInfo {...props} />);

            const AlternatePickup = wrapper.find('AlternatePickup');

            expect(AlternatePickup.length).toEqual(0);
        });
    });
    describe('pickup order notify within message section', () => {
        it('should render Box with data at containing the message if passed in props', () => {
            props.pickupOrderNotifyWithinMessage = 'pickup notification message';
            wrapper = shallow(<PickUpOrderContactInfo {...props} />);

            const pickupNotificationMessage = wrapper.findWhere(
                x =>
                    x.name() === 'Box' &&
                    x.prop('data-at') === 'contact_information_section_info_message' &&
                    x.prop('children').indexOf('pickup notification message') !== -1
            );

            expect(pickupNotificationMessage.length).toEqual(1);
        });
        it('should not render Box with data at containing the message if not passed in props', () => {
            wrapper = shallow(<PickUpOrderContactInfo {...props} />);

            const pickupNotificationMessage = wrapper.findWhere(
                x => x.name() === 'Box' && x.prop('data-at') === 'contact_information_section_info_message'
            );

            expect(pickupNotificationMessage.length).toEqual(0);
        });
    });
});
