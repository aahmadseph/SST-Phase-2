const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const MediaPopup = require('components/GlobalModals/MediaPopup/MediaPopup').default;

describe('MediaPopup component', () => {
    let wrapper;
    let props;

    beforeEach(() => {
        props = {
            isOpen: true,
            onClose: createSpy('onClose'),
            title: 'SomeTitle',
            width: 'SomeWidth',
            dataAt: 'some DataAt',
            dataAtTitle: 'some DataAt Title',
            dataAtMessage: 'some DataAt Message',
            dismissButtonText: 'Got It'
        };
    });

    describe('showMediaTitle false', () => {
        beforeEach(() => {
            wrapper = shallow(<MediaPopup {...props} />);
        });

        it('should render a modal instance', () => {
            expect(wrapper.find('Modal').length).toBe(1);
        });

        it('should render the correct modal title', () => {
            expect(wrapper.find('ModalTitle').children(0).text()).toBe('SomeTitle');
        });

        it('left content data available should render an HTML instance', () => {
            wrapper.setState({
                regions: {
                    left: [
                        {
                            text: 'someText',
                            style: { classes: 'someClasses' }
                        }
                    ],
                    right: 'someRightContent',
                    content: 'someContent'
                }
            });

            expect(wrapper.find('Html').length).toBe(1);
        });

        it('should render a button instance', () => {
            expect(wrapper.find('Button').length).toBe(1);
        });
    });
});
