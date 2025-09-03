const React = require('react');
const { createSpy } = jasmine;
const { shallow } = require('enzyme');
const store = require('Store').default;
const Actions = require('Actions').default;
const ColorIQModal = require('components/GlobalModals/ColorIQModal/ColorIQModal').default;

describe('ColorIQModal component', () => {
    describe('ctrlr method', () => {
        it('should call setAndWatch method', () => {
            // Arrange
            const setAndWatch = spyOn(store, 'setAndWatch');

            // Act
            shallow(<ColorIQModal />);

            // Assert
            expect(setAndWatch).toHaveBeenCalledTimes(1);
        });

        it('should call setAndWatch method with values', () => {
            // Arrange
            const setAndWatch = spyOn(store, 'setAndWatch');

            // Act
            const component = shallow(<ColorIQModal />).instance();

            // Assert
            expect(setAndWatch).toHaveBeenCalledWith({ 'user.beautyInsiderAccount': 'biAccount' }, component, null, true);
        });
    });

    describe('requestClose method', () => {
        it('should call callback', () => {
            // Arrange
            const props = { callback: createSpy('callback') };

            // Act
            shallow(<ColorIQModal {...props} />)
                .instance()
                .requestClose();

            // Assert
            expect(props.callback).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');

            // Act
            shallow(<ColorIQModal />)
                .instance()
                .requestClose();

            // Assert
            expect(dispatch).toHaveBeenCalledTimes(1);
        });

        it('should call dispatch method with values', () => {
            // Arrange
            const dispatch = spyOn(store, 'dispatch');
            const showColorIQModal = spyOn(Actions, 'showColorIQModal');
            const action = showColorIQModal(false);

            // Act
            shallow(<ColorIQModal />)
                .instance()
                .requestClose();

            // Assert
            expect(dispatch).toHaveBeenCalledWith(action);
        });

        it('should call showColorIqModal method', () => {
            // Arrange
            spyOn(store, 'dispatch');
            const showColorIQModal = spyOn(Actions, 'showColorIQModal');

            // Act
            shallow(<ColorIQModal />)
                .instance()
                .requestClose();

            // Assert
            expect(showColorIQModal).toHaveBeenCalledTimes(1);
        });

        it('should call showColorIqModal method with values', () => {
            // Arrange
            spyOn(store, 'dispatch');
            const showColorIQModal = spyOn(Actions, 'showColorIQModal');

            // Act
            shallow(<ColorIQModal />)
                .instance()
                .requestClose();

            // Assert
            expect(showColorIQModal).toHaveBeenCalledWith(false);
        });
    });
});
