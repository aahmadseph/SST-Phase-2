const React = require('react');
const { shallow, mount } = require('enzyme');
const Barcode = require('components/Barcode/Barcode').default;

describe('Barcode component', () => {
    let component;

    describe('Barcode SVG', () => {
        it('should render the <svg> placeholder', () => {
            // Act
            component = mount(<Barcode />);

            // Assert
            expect(component.find('svg').length).toBe(1);
        });

        it('should create a ref to the <svg> DOM element', () => {
            // Act
            component = mount(<Barcode />);

            // Assert
            expect(component.instance().svg).not.toBe(undefined);
        });
    });

    describe('ctrlr', () => {
        let propsStub;
        let createBarCodeStub;

        beforeEach(() => {
            // Arrange
            propsStub = {
                id: 1,
                code: '123456'
            };
            const wrapper = shallow(<Barcode {...propsStub} />);
            component = wrapper.instance();
            createBarCodeStub = spyOn(component, 'createBarcode');
            component.svg = {};
        });

        it('should call createBarCode once', () => {
            // Act
            component.componentDidMount();

            // Assert
            expect(createBarCodeStub).toHaveBeenCalledTimes(1);
        });

        it('should call createBarCode with correct params', () => {
            // Act
            component.componentDidMount();

            expect(createBarCodeStub).toHaveBeenCalledWith(component.svg, propsStub.id, propsStub.code);
        });
    });
});
