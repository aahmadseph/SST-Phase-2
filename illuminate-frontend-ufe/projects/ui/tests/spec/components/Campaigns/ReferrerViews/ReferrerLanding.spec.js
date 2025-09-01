/* eslint-disable object-curly-newline */
const React = require('react');
const { shallow } = require('enzyme');
const ReferrerLanding = require('components/Campaigns/Referrer/ReferrerViews/ReferrerLanding').default;
const userUtils = require('utils/User').default;

const mockedData = {
    barCodeText: 'barcodeText',
    campaignId: 'newclient2',
    campaignType: 'BISIGNUP',
    couponCode: 'BISIGNUP2',
    discountDescription: '10% off*',
    expirationDate: '5/23',
    instoreSignUp: 'in store sign up',
    instructions: {
        headline: 'To receive your discount:',
        instruction1: 'Instruction 1.',
        instruction2: 'Instruction 2.',
        instruction3: 'Instruction 3'
    },
    isBiSignUp: true,
    offerDescription: 'Join Beauty Insider online and get 10% off your next purchase.',
    offerDisclaimer: 'Terms & Conditions.',
    offerText: 'Use Code',
    promoDisclaimer: 'Promo Disclaimer.',
    promotionId: 'BISIGNUPPROMO2',
    redemptionInstructions:
        'Here is a discount for your next purchase. Use the code online or present the barcode in-store. You will also receive your discount via email.',
    referrerFirstName: 'Bill',
    referrerLastName: 'Billyson',
    referrerText: 'Invited by',
    startDate: 'valid 5/10 -',
    successCTALink: 'https://www.sephora.com',
    successMessage: ', you are now a Beauty Insider!',
    isDataReady: true
};

describe('Referrer Landing component', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<ReferrerLanding {...mockedData} />);
    });

    it('should render an offer description', () => {
        const offerDescription = wrapper
            .findWhere(n => n.prop('data-at') === 'offer_description')
            .children()
            .text();
        expect(offerDescription).toEqual(mockedData.offerDescription);
    });

    it('should render a referrer text with a First Name', () => {
        const offerText = wrapper
            .findWhere(n => n.prop('data-at') === 'referrer_text')
            .children()
            .text();
        expect(offerText).toEqual(`${mockedData.referrerText} ${mockedData.referrerFirstName}`);
    });

    it('should render an instruction headline', () => {
        const headline = wrapper
            .findWhere(n => n.prop('data-at') === 'instruction_title')
            .children()
            .text();
        expect(headline).toEqual(mockedData.instructions.headline);
    });

    it('should render instructions', () => {
        const instruction = wrapper.findWhere(n => n.prop('data-at') === 'instruction');
        const instructions = instruction.findWhere(n => n.prop('is') === 'ol').children();
        expect(instructions.length).toEqual(3);
    });

    it('should render an offer disclaimer', () => {
        const disclaimer = wrapper
            .findWhere(n => n.prop('data-at') === 'offer_disclaimer')
            .children()
            .text();
        expect(disclaimer).toEqual(mockedData.offerDisclaimer);
    });

    it('should render a instoreSignUp text', () => {
        const instoreSignUpText = wrapper.findWhere(n => n.prop('children') === mockedData.instoreSignUp);
        expect(instoreSignUpText.length).toEqual(1);
    });

    it('should render a barcode417', () => {
        expect(wrapper.find('Barcode417').length).toEqual(1);
    });

    describe('when anonymous', () => {
        it('should render a Create Account button', () => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(true);
            wrapper = shallow(<ReferrerLanding {...mockedData} />);
            const button = wrapper.findWhere(n => n.prop('data-at') === 'create_account_btn');
            expect(button.length).toEqual(1);
        });
    });
});
