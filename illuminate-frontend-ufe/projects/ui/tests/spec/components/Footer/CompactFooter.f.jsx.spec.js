const React = require('react');
const { shallow } = require('enzyme');
const CompactFooter = require('components/Footer/CompactFooter').default;

describe('CompactFooter component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<CompactFooter />);
    });

    it('renders without crashing', () => {
        expect(wrapper.exists()).toBe(true);
    });

    describe('All Link render correctly', () => {
        it('termsOfUse Link link renders corectly', () => {
            const termsOfUseLink = wrapper.findWhere(n => n.name() === 'Link' && n.prop('children') === 'Terms of Use');
            expect(termsOfUseLink.exists()).toBe(true);
        });

        it('privacyPolicy Link link renders corectly', () => {
            const privacyPolicyLink = wrapper.findWhere(n => n.name() === 'Link' && n.prop('children') === 'Privacy Policy');
            expect(privacyPolicyLink.exists()).toBe(true);
        });

        it('Phone link renders correctly', () => {
            const phoneLink = wrapper.findWhere(
                n => n.name() === 'Link' && n.prop('href') === 'tel:18777374672' && n.prop('children') === '1-877-737-4672'
            );
            expect(phoneLink.exists()).toBe(true);
        });

        it('TTY Phone link renders correctly', () => {
            const phoneNumberTTYLink = wrapper.findWhere(n => n.name() === 'Link' && n.prop('children') === 'TTY: 1-888-866-9845');
            expect(phoneNumberTTYLink.exists()).toBe(true);
        });

        it('mailto: link renders corectly', () => {
            const mailToLink = wrapper.findWhere(n => n.name() === 'Link' && n.prop('children') === 'customerservice@sephora.com');
            expect(mailToLink.exists()).toBe(true);
        });
    });
});
