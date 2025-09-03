const React = require('react');
const BiBarcode = require('components/BiBarcode/BiBarcode').default;
const { shallow } = require('enzyme');

describe('BiBarcode Component JSX', () => {
    let shallowComponent;

    describe('render', () => {
        it('should not display barcode by default', () => {
            // Act
            shallowComponent = shallow(<BiBarcode profileId={'12345'} />);

            // Assert
            expect(shallowComponent.find('Barcode417').exists()).toBeFalsy();
        });

        it('should display barcode if code is ready', () => {
            // Act
            shallowComponent = shallow(<BiBarcode profileId={'12345'} />);
            shallowComponent.setState({ code: 'code' });

            // Assert
            expect(shallowComponent.find('Barcode417').exists()).toBeTruthy();
        });

        it('should pass code to barcode component', () => {
            // Act
            shallowComponent = shallow(<BiBarcode profileId={'12345'} />);
            shallowComponent.setState({ code: 'code' });

            // Assert
            expect(shallowComponent.find('Barcode417').props().code).toEqual('code');
        });
    });
});
