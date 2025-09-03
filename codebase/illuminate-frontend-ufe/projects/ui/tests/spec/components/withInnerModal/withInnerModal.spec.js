const React = require('react');
const { shallow } = require('enzyme');

const withInnerModal = require('components/withInnerModal/withInnerModal').default;

const FakeModal = React.Component;
const FakeInnerModal = React.Component;

describe('With Inner Modal Higher Order Component', () => {
    let wrapper;
    let component;

    beforeEach(() => {
        const WithInnerModalComponent = withInnerModal(FakeModal, FakeInnerModal);
        wrapper = shallow(<WithInnerModalComponent />);
        component = wrapper.instance();
    });

    it('Should have innerModal null as default', () => {
        const { innerModal } = wrapper.props();
        expect(innerModal).toBeNull();
    });

    describe('Open and close modal', () => {
        beforeEach(() => {
            component.openModal({
                isOpen: true,
                title: 'test title'
            });
        });

        it('Should show innerModal as open', () => {
            const { innerModal } = wrapper.props();
            expect(innerModal).not.toBe(null);
        });

        it('Should set modalProps state with the open function params when open', () => {
            expect(component.state).toEqual({
                modalProps: {
                    isOpen: true,
                    title: 'test title'
                }
            });
        });

        it('Should close the innerModal', () => {
            component.closeModal();

            const { innerModal } = wrapper.props();
            expect(innerModal).toBeNull();
        });

        it('Should set modalProps state as null when close', () => {
            component.closeModal();
            expect(component.state.modalProps).toBeNull();
        });
    });
});
