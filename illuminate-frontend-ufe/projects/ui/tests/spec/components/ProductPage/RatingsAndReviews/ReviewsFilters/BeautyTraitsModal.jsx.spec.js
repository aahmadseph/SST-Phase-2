/* eslint-disable object-curly-newline */
const React = require('react');
const { objectContaining } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const actions = require('actions/Actions').default;

const BeautyTraitsModal = require('components/ProductPage/RatingsAndReviews/ReviewsFilters/BeautyTraitsModal').default;

describe('BiRegisterModal component', () => {
    let dispatchStub;
    let showbeautyTraitsModalStub;
    let checkStatusCallbackStub;
    let component;
    let props;
    let wrapper;

    beforeEach(() => {
        dispatchStub = spyOn(store, 'dispatch');
        showbeautyTraitsModalStub = spyOn(actions, 'showBeautyTraitsModal');
        props = {
            isOpen: true,
            checkStatusCallback: () => {}
        };
        checkStatusCallbackStub = spyOn(props, 'checkStatusCallback');
        wrapper = shallow(<BeautyTraitsModal {...props} />);
        component = wrapper.instance();
    });
    describe('close modal', () => {
        it('should dispatch BeautyTraitsModal false', () => {
            // Arrange/Act
            component.requestClose();

            // Assert
            expect(dispatchStub).toHaveBeenCalledTimes(1);
            expect(showbeautyTraitsModalStub).toHaveBeenCalledWith(objectContaining({ isOpen: false }));
        });
    });

    describe('edit Profile', () => {
        it('should dispatch BeautyTraitsModal false', () => {
            // Arrange/Act
            component.editProfile();

            // Assert
            expect(showbeautyTraitsModalStub).toHaveBeenCalledWith(objectContaining({ isOpen: false }));
            expect(checkStatusCallbackStub).toHaveBeenCalledTimes(1);
        });
    });

    describe('render()', () => {
        it('should render Modal title', () => {
            const modalTitle = wrapper.find('ModalTitle').props();
            expect(modalTitle.children).toBe('Your Beauty Matches');
        });

        it('should render Modal Body', () => {
            const modalBody = wrapper.find('ModalBody');
            expect(modalBody.exists()).toBeTruthy();
        });

        it('should have first button as Add traits', () => {
            const button = wrapper.find('Button').at(0).props();
            expect(button.children).toBe('Add Traits');
        });
    });
});
