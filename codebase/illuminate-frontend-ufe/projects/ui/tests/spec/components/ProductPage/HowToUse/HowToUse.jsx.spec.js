const React = require('react');
const { shallow } = require('enzyme');
const HowToUse = require('components/ProductPage/HowToUse/HowToUse').default;

describe('<HowToUse />', () => {
    it('should be rendered as accordion', () => {
        // Act
        const component = shallow(<HowToUse content='something' />);
        const accordionElement = component.find('Accordion');

        // Assert
        expect(accordionElement.exists()).toBe(true);
    });

    it('should not render anything if there\'s no content', () => {
        // Act
        const component = shallow(<HowToUse />);
        const accordionElement = component.find('Accordion');

        // Assert
        expect(accordionElement.isEmptyRender()).toBeTruthy();
    });

    it('should render FAQ title if sku is Reward Card', () => {
        // Act
        const component = shallow(
            <HowToUse
                content='something'
                currentSku={{ rewardSubType: 'Reward_Card' }}
            />
        );
        const accordionElement = component.find('Accordion');

        // Assert
        expect(accordionElement.props().title).toEqual('FAQ');
    });

    it('should render FAQ title if sku is Reward', () => {
        // Act
        const component = shallow(
            <HowToUse
                content='something'
                currentSku={{ biType: 'reward' }}
            />
        );
        const accordionElement = component.find('Accordion');

        // Assert
        expect(accordionElement.props().title).toEqual('FAQ');
    });

    it('should render FAQ title if sku is Subscription', () => {
        // Act
        const component = shallow(
            <HowToUse
                content='something'
                currentSku={{ type: 'subscription' }}
            />
        );
        const accordionElement = component.find('Accordion');

        // Assert
        expect(accordionElement.props().title).toEqual('FAQ');
    });

    it('should render How To Use title if sku is Standard product', () => {
        // Act
        const component = shallow(
            <HowToUse
                content='something'
                currentSku={{ type: 'standard' }}
            />
        );
        const accordionElement = component.find('Accordion');

        // Assert
        expect(accordionElement.props().title).toEqual('How to Use');
    });

    it('should pass a unique id for Accordion so it will be able to scroll to it', () => {
        // Act
        const component = shallow(
            <HowToUse
                content='something'
                currentSku={{ type: 'standard' }}
            />
        );
        const accordionElement = component.find('Accordion');

        // Assert
        expect(accordionElement.props().id).toEqual('howtouse');
    });
});
