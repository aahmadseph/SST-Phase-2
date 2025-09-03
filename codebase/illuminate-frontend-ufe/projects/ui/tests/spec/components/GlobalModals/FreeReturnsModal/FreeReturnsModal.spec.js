const React = require('react');
const { shallow } = require('enzyme');
const FreeReturnsModal = require('components/GlobalModals/FreeReturnsModal/FreeReturnsModal').default;

describe('FreeReturnsModal component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<FreeReturnsModal />);
    });

    describe('modal render', () => {
        it('should render a FreeReturnsModal', () => {
            const freeReturnsModal = wrapper.find('Modal');
            expect(freeReturnsModal.length).toBe(1);
        });

        it('should render with the hard coded title', () => {
            const title = wrapper.find('ModalTitle').children(0);
            expect(title.text()).toEqual('Free Returns');
        });
    });
});
