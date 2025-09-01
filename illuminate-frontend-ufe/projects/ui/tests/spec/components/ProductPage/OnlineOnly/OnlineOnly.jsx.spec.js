const React = require('react');
const { shallow } = require('enzyme');
const OnlineOnly = require('components/ProductPage/OnlineOnly/OnlineOnly').default;

describe('<OnlineOnly />', () => {
    it('should render div with a valid textDataAt', () => {
        const component = shallow(<OnlineOnly />, { disableLifecycleMethods: true });

        const element = component.findWhere(x => x.name() === 'div' && x.prop('data-at') === 'pdp_marketing_flag');

        expect(element.exists()).toBeTruthy();
    });
});
