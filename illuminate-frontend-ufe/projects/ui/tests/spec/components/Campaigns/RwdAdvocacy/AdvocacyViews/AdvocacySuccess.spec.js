const React = require('react');
const { shallow } = require('enzyme');
const AdvocacySuccess = require('components/Campaigns/RwdAdvocacy/AdvocacyViews/AdvocacySuccess/AdvocacySuccess').default;

const props = {
    globalInvitationText: 'Invited By',
    locales: {
        barcodeScan: 'scan barcode',
        redemptionInstructions: 'test redemption instructions',
        shopNow: 'Shop Now',
        yourNextPurchase: 'Your Next Purchase',
        redeemOnline: 'redeem Online',
        valid: 'Valid'
    },
    successConfirmationText: ', you are now beauty insider',
    successInstructions: {
        nodeType: 'document',
        data: {},
        content: [
            {
                nodeType: 'heading-4',
                data: {},
                content: [
                    {
                        nodeType: 'text',
                        value: 'To receive your discount:',
                        marks: [
                            {
                                type: 'bold'
                            }
                        ],
                        data: {}
                    }
                ]
            }
        ]
    },
    successDiscountDescription: '10% off',
    successPromoStartDate: '2024-08-31T09:15:00.000-07:00',
    successPromoEndDate: '2024-06-01T09:15:00.000-07:00',
    successCtaLink: '',
    successCouponCode: '1234',
    successDisclaimer: '',
    referrerFirstName: 'user123',
    user: {
        firstName: 'Test'
    }
};

describe('Advocacy Success Component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<AdvocacySuccess {...props} />);
    });

    it('should render text with first name of referrer', () => {
        const offerText = wrapper
            .findWhere(n => n.prop('data-at') === 'referrer_text')
            .children()
            .text();
        expect(offerText).toEqual(`${props.globalInvitationText} ${props.referrerFirstName}`);
    });

    it('should render successConfirmationText', () => {
        const offerDescription = wrapper
            .findWhere(n => n.prop('data-at') === 'promo_confirmation')
            .children()
            .text();
        expect(offerDescription).toEqual(`${props.user.firstName}${props.successConfirmationText}`);
    });

    it('should render a BarCode', () => {
        expect(wrapper.find('Barcode').length).toEqual(1);
    });
});
