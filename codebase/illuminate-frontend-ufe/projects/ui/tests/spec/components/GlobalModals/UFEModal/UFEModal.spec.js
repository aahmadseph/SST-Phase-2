const React = require('react');
const { shallow } = require('enzyme');
const UFEModal = require('components/GlobalModals/UFEModal/UFEModal').default;
const cmsApi = require('services/api/cms').default;
const store = require('Store').default;

describe('UFEModal component', () => {
    describe('componentDidMount', () => {
        it('should not call getUFEComponentContent if has not ufeModalId', () => {
            // Arrange
            const getUFEComponentContentStub = spyOn(cmsApi, 'getUFEComponentContent').and.returnValue(Promise.resolve());

            // Act
            shallow(<UFEModal />);

            // Assert
            expect(getUFEComponentContentStub).not.toHaveBeenCalled();
        });

        it('should call getUFEComponentContent if has ufeModalId', () => {
            // Arrange
            const getUFEComponentContent = spyOn(cmsApi, 'getUFEComponentContent').and.returnValue(Promise.resolve({ someData: [] }));

            // Act
            shallow(<UFEModal ufeModalId='007' />);

            // Assert
            expect(getUFEComponentContent).toHaveBeenCalled();
        });

        it('should set modalComponent if has ufeModalId', done => {
            const component = shallow(<UFEModal ufeModalId='007' />).instance();
            const setStateStub = spyOn(component, 'setState');
            const fakePromise = {
                then: function (resolve) {
                    resolve({ someData: [] });
                    expect(setStateStub).toHaveBeenCalledWith({ modalComponent: { someData: [] } });
                    done();

                    return fakePromise;
                }
            };
            spyOn(cmsApi, 'getUFEComponentContent').and.returnValue(fakePromise);
            component.componentDidMount();
        });
    });

    it('requestClose should call dispatch', () => {
        // Arrange
        const dispatchStub = spyOn(store, 'dispatch');

        // Act
        shallow(<UFEModal ufeModalId='007' />)
            .instance()
            .requestClose();

        // Assert
        expect(dispatchStub).toHaveBeenCalled();
    });
});
