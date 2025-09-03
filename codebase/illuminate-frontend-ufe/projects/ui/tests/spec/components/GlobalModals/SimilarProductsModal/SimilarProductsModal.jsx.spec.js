const React = require('react');
const { shallow } = require('enzyme');
let store;
let actions;
let SimilarProductsModal;

describe('SimilarProductsModal component', () => {
    let wrapper;

    beforeEach(() => {
        store = require('Store').default;
        actions = require('actions/Actions').default;
        SimilarProductsModal = require('components/GlobalModals/SimilarProductsModal/SimilarProductsModal').default;
        wrapper = shallow(
            <SimilarProductsModal
                itemId='12345'
                brandName='my brand name'
                productName='my product name'
                skuId='123'
            />
        );
    });

    it('should render a modal instance', () => {
        const ModalComp = wrapper.find('Modal');
        expect(ModalComp.length).toBe(1);
    });

    describe('ProductImage', () => {
        let ProductImageComp;

        beforeEach(() => {
            ProductImageComp = wrapper.find('ProductImage');
        });

        it('should render an instance', () => {
            expect(ProductImageComp.length).toBe(1);
        });

        it('should render with id', () => {
            expect(ProductImageComp.prop('id')).toEqual('123');
        });
    });

    describe('ProductDisplayName', () => {
        let ProductDisplayNameComp;

        beforeEach(() => {
            ProductDisplayNameComp = wrapper.find('ProductDisplayName');
        });

        it('should render an instance', () => {
            expect(ProductDisplayNameComp.length).toBe(1);
        });

        it('should render with brandName', () => {
            expect(ProductDisplayNameComp.prop('brandName')).toEqual('my brand name');
        });

        it('should render productName', () => {
            expect(ProductDisplayNameComp.prop('productName')).toEqual('my product name');
        });
    });

    it('should dispatch showSimilarProductsModal false', () => {
        // Arrange
        const dispatchStub = spyOn(store, 'dispatch');
        const showSimilarProductsModalStub = spyOn(actions, 'showSimilarProductsModal');
        const component = new SimilarProductsModal({});

        // Act
        component.requestClose();

        // Assert
        expect(dispatchStub).toHaveBeenCalledTimes(1);
        expect(showSimilarProductsModalStub).toHaveBeenCalledWith({ isOpen: false });
    });
});
