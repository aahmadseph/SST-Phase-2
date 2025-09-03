describe('<TrackOrderButton /> component', () => {
    let React;
    let TrackOrderButton;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        TrackOrderButton = require('components/RichProfile/MyAccount/TrackOrderButton/TrackOrderButton').default;
        shallowComponent = enzyme.mount(<TrackOrderButton />);
    });

    it('should render the TrackOrderButton component', () => {
        expect(shallowComponent.find('TrackOrderButton').length).toEqual(1);
    });

    it('should render a Button component', () => {
        expect(shallowComponent.find('Button').length).toEqual(1);
    });

    describe('when shipping status is Pending', () => {
        beforeEach(() => {
            shallowComponent.setProps({ status: 'Pending' });
        });

        it('should render a Button component containing the correct label', () => {
            expect(shallowComponent.find('Button').props().children === 'Track & Get SMS Updates');
        });

        it('should render a Text component', () => {
            expect(shallowComponent.find('Text').length).toEqual(1);
        });

        it('should render a Text component with correct message', () => {
            expect(shallowComponent.find('Text').props().children === 'Tracking will become available when the order ships.');
        });

        it('should render the button in its disabled state', () => {
            expect(shallowComponent.find('Button').props().disabled).toEqual(true);
        });
    });

    describe('when shipping status is Canceled', () => {
        beforeEach(() => {
            shallowComponent.setProps({ status: 'Cancelled' });
        });

        it('should render a Button component containing the correct label', () => {
            expect(shallowComponent.find('Button').props().children === 'Track & Get SMS Updates');
        });

        it('should not render a Text component', () => {
            expect(shallowComponent.find('Text').length).toEqual(1);
        });

        it('should render a Text component with correct message', () => {
            expect(shallowComponent.find('Text').props().children === 'Tracking not available for canceled orders.');
        });

        it('should render the button in its disabled state', () => {
            expect(shallowComponent.find('Button').props().disabled).toEqual(true);
        });
    });

    describe('when shipping status is Active', () => {
        beforeEach(() => {
            shallowComponent.setProps({ status: 'Active' });
        });

        it('should render a Button component containing the correct label', () => {
            expect(shallowComponent.find('Button').props().children === 'Track & Get SMS Updates');
        });

        it('should not render a Text component', () => {
            expect(shallowComponent.find('Text').length).toEqual(0);
        });

        it('should render the button in its active state', () => {
            expect(shallowComponent.find('Button').props().disabled).not.toEqual(true);
        });
    });

    describe('when shipping status is Delivered', () => {
        beforeEach(() => {
            shallowComponent.setProps({ status: 'Delivered' });
        });

        it('should render a Button component containing the correct label', () => {
            expect(shallowComponent.find('Button').props().children === 'View tracking info');
        });

        it('should not render a Text component', () => {
            expect(shallowComponent.find('Text').length).toEqual(0);
        });

        it('should render the button in its active state', () => {
            expect(shallowComponent.find('Button').props().disabled).not.toEqual(true);
        });
    });
});
