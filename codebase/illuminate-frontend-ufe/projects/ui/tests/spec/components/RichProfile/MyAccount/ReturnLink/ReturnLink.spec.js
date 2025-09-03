describe('ReturnLink component', () => {
    let React;
    let ReturnLink;
    let props;
    let LocaleUtils;
    let shallowComponent;

    beforeEach(() => {
        React = require('react');
        ReturnLink = require('components/RichProfile/MyAccount/ReturnLink/ReturnLink').default;
        LocaleUtils = require('utils/LanguageLocale').default;
    });

    describe('US locale', () => {
        beforeEach(() => {
            props = {
                orderId: '34234234',
                shipGroups: [
                    {
                        shippingGroup: {
                            address: {
                                country: 'US',
                                postalCode: '94105'
                            }
                        }
                    }
                ]
            };
        });

        it('should set the correct url & zip when the locale is US', () => {
            shallowComponent = enzyme.shallow(<ReturnLink {...props} />);
            const hrefToCompare = 'https://returns.narvar.com/sephora/returns?locale=en_US&order=34234234&dzip=94105';
            const link = shallowComponent.closest('Link');
            const href = link.props().href;
            expect(href).toEqual(hrefToCompare);
        });
    });

    describe('Canada locale', () => {
        beforeEach(() => {
            props = {
                orderId: '34234234',
                shipGroups: [
                    {
                        shippingGroup: {
                            address: {
                                country: 'CA',
                                postalCode: 'L9P 1M1'
                            }
                        }
                    }
                ]
            };
        });

        it('should set the correct url & zip  when the locale is CA', () => {
            spyOn(LocaleUtils, 'isCanada').and.callFake(() => true);
            shallowComponent = enzyme.shallow(<ReturnLink {...props} />);
            const hrefToCompare = 'https://returns.narvar.com/sephora/returns?locale=EN_CA&order=34234234&dzip=L9P 1M1';
            const link = shallowComponent.closest('Link');
            const href = link.props().href;
            expect(href).toEqual(hrefToCompare);
        });

        it('should set the correct url & zip when the locale is CA and the language is French', () => {
            spyOn(LocaleUtils, 'isCanada').and.callFake(() => true);
            spyOn(LocaleUtils, 'isFrench').and.callFake(() => true);
            shallowComponent = enzyme.shallow(<ReturnLink {...props} />);
            const hrefToCompare = 'https://returns.narvar.com/sephora/returns?locale=FR_CA&order=34234234&dzip=L9P 1M1';
            const link = shallowComponent.closest('Link');
            const href = link.props().href;
            expect(href).toEqual(hrefToCompare);
        });
    });
});
