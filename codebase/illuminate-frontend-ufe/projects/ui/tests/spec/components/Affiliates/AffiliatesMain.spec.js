const React = require('react');
const { shallow } = require('enzyme');
const UrlUtils = require('utils/Url').default;
const AffiliatesMain = require('components/Affiliates/AffiliatesMain').default;
const cookieUtils = require('utils/Cookies').default;
const dateUtils = require('utils/Date').default;

describe('AffiliatesMain component', function () {
    const linkshareCookiesLifetime = 500;
    let component;
    let redirectTo;
    let getParamsStub;

    beforeEach(() => {
        redirectTo = spyOn(UrlUtils, 'redirectTo');
        getParamsStub = spyOn(UrlUtils, 'getParams').and.returnValue({});

        const props = { linkshareCookiesLifetime };
        component = shallow(<AffiliatesMain {...props} />).instance();
    });

    describe('controller', () => {
        let cookieWriteStub;

        beforeEach(() => {
            cookieWriteStub = spyOn(cookieUtils, 'write');
            spyOn(dateUtils, 'formatISODateVariation').and.returnValue('date_str');
        });

        it('should redirect to the HP if no url passed', () => {
            component.componentDidMount();
            expect(redirectTo).toHaveBeenCalledWith('/');
        });

        it('should redirect to the passed url', () => {
            getParamsStub.and.returnValue({ url: ['example.com'] });
            component.componentDidMount();
            expect(redirectTo).toHaveBeenCalledWith('example.com');
        });

        it('should not set siteId cookie if param is missing', () => {
            component.componentDidMount();
            expect(cookieWriteStub).not.toHaveBeenCalledWith('siteId');
        });

        describe('if siteID is passed', () => {
            beforeEach(() => {
                getParamsStub.and.returnValue({ siteID: ['some_site_id'] });
                component.componentDidMount();
            });

            it('should set siteId cookie', () => {
                expect(cookieWriteStub).toHaveBeenCalledWith('siteId', 'some_site_id', linkshareCookiesLifetime, false);
            });

            it('should set linkShareTime cookie with siteId', () => {
                expect(cookieWriteStub).toHaveBeenCalledWith('linkShareTime', 'date_str|some_site_id', linkshareCookiesLifetime, false);
            });
        });
    });
});
