describe('RewardSection', () => {
    let React;
    let shallow;
    let shallowComponent;
    let RewardSection;

    beforeEach(() => {
        React = require('react');
        RewardSection = require('components/Reward/RewardSection/RewardSection').default;
        shallow = enzyme.shallow;
    });

    describe('onHeadClick', () => {
        it('should render Chevron', () => {
            shallowComponent = shallow(<RewardSection onHeadClick={true} />);
            expect(shallowComponent.find('Chevron').length).toBe(1);
        });

        it('should render Chevron with correct props with isHeaderOnly', () => {
            shallowComponent = shallow(
                <RewardSection
                    onHeadClick={true}
                    isHeaderOnly={true}
                />
            );
            expect(shallowComponent.find('Chevron').props().direction).toBe('right');
        });

        it('should render Chevron with correct props w/o isHeaderOnly', () => {
            shallowComponent = shallow(<RewardSection onHeadClick={true} />);
            expect(shallowComponent.find('Chevron').props().direction).toBe('down');
        });
    });

    describe('isHeaderOnly', () => {
        let child;

        beforeEach(() => {
            child = <div>123</div>;
        });

        it('should not render children if isHeaderOnly', () => {
            shallowComponent = shallow(
                <RewardSection
                    isHeaderOnly={true}
                    children={child}
                />
            );
            expect(shallowComponent.find('Flex > div').length).toBe(0);
        });

        it('should render children if not isHeaderOnly', () => {
            shallowComponent = shallow(
                <RewardSection
                    isHeaderOnly={false}
                    children={child}
                />
            );
            expect(shallowComponent.find('Flex > div').length).toBe(1);
        });
    });

    describe('with headImage', () => {
        let mountedComponent;

        beforeEach(() => {
            const props = {
                headContent: '+headContent+',
                headImage: '-headImage-'
            };

            if (!mountedComponent) {
                mountedComponent = enzyme.mount(<RewardSection {...props} />);
            }
        });

        xit('should render headContent', () => {
            expect(mountedComponent.find('LegacyGrid').text().indexOf('+headContent+')).toBeGreaterThan(-1);
        });

        xit('should render headImage', () => {
            expect(mountedComponent.find('LegacyGrid').text().indexOf('-headImage-')).toBeGreaterThan(-1);
        });

        it('should not render Chevron', () => {
            expect(mountedComponent.find('Chevron').length).toBe(0);
        });
    });
});
