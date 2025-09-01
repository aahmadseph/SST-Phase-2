const React = require('react');
const { shallow } = require('enzyme');
const Store = require('Store').default;
const actions = require('Actions').default;
const BccLink = require('components/Bcc/BccLink/BccLink').default;

describe('BccLink component', () => {
    let event;

    beforeEach(() => {
        spyOn(Store, 'dispatch');
    });

    describe('BccLink.prototype.toggleOpen', () => {
        let showBccModalStub;
        let showMediaModalStub;
        let props;
        let bannerCallbackStub;

        beforeEach(() => {
            event = { preventDefault: () => {} };
            spyOn(event, 'preventDefault');
            showBccModalStub = spyOn(actions, 'showBccModal');
            showMediaModalStub = spyOn(actions, 'showMediaModal');
            props = {
                url: '/',
                text: 'Sample text',
                title: 'Sample title',
                target: 2,
                bannerCallback: () => {}
            };
            bannerCallbackStub = spyOn(props, 'bannerCallback');
        });

        describe('preventDefault', () => {
            it('should not call it if the target is SAME window', () => {
                // Arrange
                props.target = 0;
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click', event);

                // Assert
                expect(event.preventDefault).not.toHaveBeenCalled();
            });

            it('should not call it if the target is NEW window', () => {
                // Arrange
                props.target = 1;
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click', event);

                // Assert
                expect(event.preventDefault).not.toHaveBeenCalled();
            });

            it('should call it if the target is OVERLAY', () => {
                // Arrange
                props.target = 2;
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click', event);

                // Assert
                expect(event.preventDefault).toHaveBeenCalled();
            });
        });

        describe('showBccModal dispatch', () => {
            it('should dispatch it', () => {
                // Arrange
                props.modalTemplate = {};
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(showBccModalStub).toHaveBeenCalledTimes(1);
            });

            it('should not dispatch it', () => {
                // Arrange
                props.modalTemplate = null;
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(showBccModalStub).not.toHaveBeenCalled();
            });

            it('should not dispath showMediaModal', () => {
                // Arrange
                props.modalTemplate = {};
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(showMediaModalStub).not.toHaveBeenCalled();
            });

            it('should not call bannerCallback', () => {
                // Arrange
                props.modalTemplate = {};
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(bannerCallbackStub).not.toHaveBeenCalled();
            });
        });

        describe('showMediaModal dispatch', () => {
            it('should dispatch it', () => {
                // Arrange
                props.targetScreen = { mediaId: 'anyId' };
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(showMediaModalStub).toHaveBeenCalled();
            });

            it('should not dispatch it', () => {
                // Arrange
                props.targetScreen = null;
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(showMediaModalStub).not.toHaveBeenCalled();
            });

            it('should not dispatch it', () => {
                // Arrange
                props.targetScreen = {};
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(showMediaModalStub).not.toHaveBeenCalled();
            });

            it('should not dispath showBccModal', () => {
                // Arrange
                props.targetScreen = { mediaId: 'anyId' };
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(showBccModalStub).not.toHaveBeenCalled();
            });

            it('should not call bannerCallback', () => {
                // Arrange
                props.targetScreen = { mediaId: 'anyId' };
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(bannerCallbackStub).not.toHaveBeenCalled();
            });
        });

        describe('bannerCallback', () => {
            it('should call it', () => {
                // Arrange
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(bannerCallbackStub).toHaveBeenCalled();
            });

            it('should call not it if modalTemplate is defined', () => {
                // Arrange
                props.modalTemplate = {};
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(bannerCallbackStub).not.toHaveBeenCalled();
            });

            it('should call not it if mediaId is defined', () => {
                // Arrange
                props.targetScreen = { mediaId: 'anyId' };
                const wrapper = shallow(<BccLink {...props} />);
                const component = wrapper.find('Link');

                // Act
                component.simulate('click');

                // Assert
                expect(bannerCallbackStub).not.toHaveBeenCalled();
            });
        });
    });
});
