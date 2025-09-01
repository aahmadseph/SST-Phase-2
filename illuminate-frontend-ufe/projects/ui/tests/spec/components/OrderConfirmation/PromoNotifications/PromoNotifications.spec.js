const React = require('react');
const { shallow } = require('enzyme');
const PromoNotifications = require('components/OrderConfirmation/PromoNotifications/PromoNotifications').default;

describe('<PromoNotifications /> component', () => {
    const props = {
        basketLevelMessages: [
            {
                text: 'Use promo code **BB234985** to qualify for 15% off your next purchase. <Enhancer type="applyPromoCTA" arguments="BB234985">**Apply Now ▸**</Enhancer> ',
                isEmoticon: true,
                icon: '🎉',
                isQualified: true
            },
            {
                text: 'Spend $12 more to get 15% off your next purchase',
                isEmoticon: false,
                icon: 'offers',
                isQualified: false
            }
        ]
    };

    describe('render', () => {
        it('renders 2 <PromoNotifications /> component', () => {
            const wrapper = shallow(<PromoNotifications notifications={props.basketLevelMessages} />);
            const nodes = wrapper.findWhere(x => x.name() === 'div');
            expect(nodes.length).toEqual(2);
        });

        it('should contain a 🎉  for qualified offers', () => {
            const wrapper = shallow(<PromoNotifications notifications={props.basketLevelMessages} />);
            const node = wrapper.findWhere(x => x.name() === 'Text');
            expect(node.props().children).toContain('🎉');
        });

        it('should contain the offer image with message', () => {
            const wrapper = shallow(<PromoNotifications notifications={props.basketLevelMessages} />);
            const icon = wrapper.findWhere(x => x.name() === 'Icon' && x.prop('name') === 'offers');
            expect(icon.length).toEqual(1);
        });

        it('should contain a lightBlue background for qualified offers', () => {
            const wrapper = shallow(<PromoNotifications notifications={props.basketLevelMessages} />);
            expect(wrapper.find('Grid').first().props().backgroundColor).toEqual('lightBlue');
        });
    });
});
