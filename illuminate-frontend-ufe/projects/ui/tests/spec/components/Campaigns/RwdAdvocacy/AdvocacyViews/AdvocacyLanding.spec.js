const React = require('react');
const { shallow } = require('enzyme');
const AdvocacyLanding = require('components/Campaigns/RwdAdvocacy/AdvocacyViews/AdvocacyLanding/AdvocacyLanding').default;

const props = {
    globalInvitationText: 'Invited By',
    referralOfferDescription: 'referral offer description',
    referralInstructions: {
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
    referralBarcodeText: '',
    referralDisclaimer: '',
    referrerFirstName: 'user123',
    barCodeText: '123456789',
    campaignType: 'FnF',
    isFnF: false,
    isBiSignUp: false
};

describe('Advocacy Landing Component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<AdvocacyLanding {...props} />);
    });

    it('should render text with first name of referrer', () => {
        const offerText = wrapper
            .findWhere(n => n.prop('data-at') === 'referrer_text')
            .children()
            .text();
        expect(offerText).toEqual(`${props.globalInvitationText} ${props.referrerFirstName}`);
    });

    it('should render referral offer description', () => {
        const offerDescription = wrapper
            .findWhere(n => n.prop('data-at') === 'offer_description')
            .children()
            .text();
        expect(offerDescription).toEqual(props.referralOfferDescription);
    });
});
