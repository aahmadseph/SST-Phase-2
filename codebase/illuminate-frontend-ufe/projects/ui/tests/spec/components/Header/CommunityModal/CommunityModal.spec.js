const React = require('react');
const { shallow } = require('enzyme');

describe('CommunityModal JSX file', () => {
    let CommunityModal;
    let wrapper;

    beforeEach(() => {
        CommunityModal = require('components/Header/CommunityModal/CommunityModal.f').default;
        wrapper = shallow(<CommunityModal />, { disableLifecycleMethods: true });
    });

    describe('Main content', () => {
        it('should render Modal component', () => {
            expect(wrapper.find('Modal').length).toEqual(1);
        });

        it('should render ModalHeader component', () => {
            expect(wrapper.find('ModalHeader').length).toEqual(1);
        });

        it('should render ModalTitle component', () => {
            expect(wrapper.find('ModalTitle').length).toEqual(1);
        });

        it('should render ModalBody component', () => {
            expect(wrapper.find('ModalBody').length).toEqual(1);
        });
    });
});
