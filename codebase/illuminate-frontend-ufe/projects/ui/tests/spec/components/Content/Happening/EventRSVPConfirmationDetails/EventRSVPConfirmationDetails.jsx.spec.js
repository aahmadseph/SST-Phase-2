/* eslint-disable no-unused-vars */
const React = require('react');
const { shallow } = require('enzyme');

describe('EventConfirmationDetails Component', () => {
    let wrapper;
    let props;
    let Location;
    let EventConfirmationDetails;
    let HappeningBindings;

    beforeEach(() => {
        EventConfirmationDetails = require('components/Content/Happening/EventRSVPConfirmationDetails/EventRSVPConfirmationDetails').default;

        Location = require('utils/Location').default;
        HappeningBindings = require('analytics/bindingMethods/components/Content/Happening/HappeningBindings').default;

        props = {
            reservationDetails: {
                smsPhoneNumber: '123-456-7890',
                imageUrl: 'https://example.com/image.jpg',
                activityName: 'Yoga Class',
                confirmationNumber: 'ABC123',
                clientEmail: 'test@example.com',
                startDateTime: '2024-09-01T10:00:00Z',
                duration: 60,
                store: {
                    timeZone: 'America/Los_Angeles',
                    displayName: 'Sephora Store',
                    storeId: 'store_123'
                }
            }
        };

        spyOn(HappeningBindings, 'eventRSVPConfirmationPageLoadAnalytics')
            .withArgs(props.reservationDetails.activityName, props.reservationDetails.store.storeId)
            .and.callThrough();
        wrapper = shallow(<EventConfirmationDetails {...props} />);
    });

    it('should render correctly with given props', () => {
        const text = wrapper.find('Box').find('Text').at(3);
        expect(text.props().children).toEqual('Sephora Store');
    });

    it('should trigger eventRSVPConfirmationPageLoadAnalytics on load', () => {
        expect(HappeningBindings.eventRSVPConfirmationPageLoadAnalytics).toHaveBeenCalledWith('Yoga Class', 'store_123');
    });

    it('should display phone confirmation message if smsPhoneNumber is provided', () => {
        expect(wrapper.find('Text').at(1).find('Text').at(1).props().children[0]).toContain('(123) -45-6-7890');
    });

    it('should display email confirmation message if smsPhoneNumber is not provided', () => {
        wrapper.setProps({
            reservationDetails: {
                ...props.reservationDetails,
                smsPhoneNumber: null
            }
        });
        expect(wrapper.find('Text').at(1).find('Text').at(1).props().children[0]).toContain('test@example.com');
    });

    it('should call Location.navigateTo when "View All" button is clicked', () => {
        const e = { type: 'click' };
        const navigateToSpy = spyOn(Location, 'navigateTo');
        const button = wrapper.findWhere(n => n.name() === 'Button' && n.props().children === 'View All Reservations');

        button.simulate('click', e);
        expect(navigateToSpy).toHaveBeenCalledWith(e, '/happening/reservations');
    });

    it('should not render anything if reservationDetails is not provided', () => {
        wrapper.setProps({ reservationDetails: null });
        expect(wrapper.isEmptyRender()).toBe(true);
    });
});
