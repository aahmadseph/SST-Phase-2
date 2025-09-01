const React = require('react');
const { shallow } = require('enzyme');
const { any } = jasmine;
const BccModal = require('components/Bcc/BccModal/BccModal').default;
const processEvent = require('analytics/processEvent').default;
const anaConsts = require('analytics/constants').default;

describe('BccModal component', () => {
    let component;
    let analyticsProcessStub;

    beforeEach(() => {
        analyticsProcessStub = spyOn(processEvent, 'process');
    });

    describe('Controller initialization', () => {
        it('should track analytics if opened', () => {
            // Arrange
            const props = {
                name: 'testName',
                modalState: true
            };

            // Act
            shallow(<BccModal {...props} />);

            // Assert
            expect(analyticsProcessStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: [any(Function)],
                    bccComponentName: 'testName'
                }
            });
        });

        it('should not track analytics if not opened', () => {
            // Arrange
            const props = { modalState: false };

            // Act
            shallow(<BccModal {...props} />);

            // Assert
            expect(analyticsProcessStub).not.toHaveBeenCalled();
        });
    });

    describe('Toggle Open State of a Modal', () => {
        let props;

        beforeEach(() => {
            props = { name: 'testName' };
            const wrapper = shallow(<BccModal {...props} />);
            component = wrapper.instance();
        });

        it('should open modal', () => {
            component.toggleOpen();
            expect(component.state.isOpen).toBe(true);
        });

        it('should track analytics for open state', () => {
            // Act
            component.toggleOpen();

            // Assert
            expect(analyticsProcessStub).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, {
                data: {
                    bindingMethods: [any(Function)],
                    bccComponentName: props.name
                }
            });
        });

        it('should close modal if it was opened', () => {
            component.setState({ isOpen: true });
            component.toggleOpen();
            expect(component.state.isOpen).toBe(false);
        });

        it('should not track analytics for close state', () => {
            component.setState({ isOpen: true });
            component.toggleOpen();
            expect(analyticsProcessStub).not.toHaveBeenCalled();
        });
    });
});
