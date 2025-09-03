const React = require('react');
const { shallow } = require('enzyme');
const ShipAddressDisplay = require('components/Checkout/Sections/ShipAddress/Display/ShipAddressDisplay').default;

describe('ShipAddressDisplay component', () => {
    const wrapper = shallow(<ShipAddressDisplay />);

    it('should be rendered', () => {
        expect(wrapper.isEmptyRender()).toBeFalsy();
    });

    describe('AccessPointButton component', () => {
        const props = {
            address: true,
            isComplete: true,
            isHalAvailable: true
        };

        it('should be rendered when ShipAddressDisplay props address && isComplete are true', () => {
            const wrapperWithProps = shallow(<ShipAddressDisplay {...props} />);
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            expect(accessPointBtn.length).toBe(1);
        });

        it('should NOT be rendered when ShipAddressDisplay prop isHalAvailable is false', () => {
            const wrapperWithProps = shallow(
                <ShipAddressDisplay
                    {...props}
                    isHalAvailable={false}
                />
            );
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            expect(accessPointBtn.length).toBe(0);
        });

        it('should be of variant "noTitle"', () => {
            const wrapperWithProps = shallow(<ShipAddressDisplay {...props} />);
            const accessPointBtn = wrapperWithProps.find('ConnectedAccessPointButton');
            const noTitleVariant = accessPointBtn.props().variant;
            expect(noTitleVariant).toEqual('noTitle');
        });
    });
});
