/* eslint-disable no-unused-vars */
const React = require('react');
const { objectContaining } = jasmine;
const { shallow } = require('enzyme');
const Footer = require('components/Footer/Footer').default;
const processEvent = require('analytics/processEvent').default;
const analyticsUtils = require('analytics/utils').default;
const { LINK_TRACKING_EVENT } = require('analytics/constants').default;
const localeUtils = require('utils/LanguageLocale').default;
const Storage = require('utils/localStorage/Storage').default;
const LOCAL_STORAGE = require('utils/localStorage/Constants').default;

describe('Footer component', () => {
    let shallowComponent;
    let props;

    beforeEach(() => {
        props = {
            isCompact: false
        };

        shallowComponent = shallow(<Footer {...props} />);
    });

    describe('App banners', () => {
        it('should perform an analytics call when clicking on apple app banner ', () => {
            // Ararange
            const processStub = spyOn(processEvent, 'process');
            digitalData.page.attributes.previousPageData.pageName = 'home page:home page:n/a:*';
            const data = {
                actionInfo: 'footer:downloadtheapp:apple',
                linkName: 'footer:downloadtheapp:apple',
                eventStrings: ['event71'],
                previousPage: 'home page:home page:n/a:*'
            };

            // Act
            shallowComponent.find('#appBanners_apple').simulate('click');

            // Assert
            expect(processStub).toHaveBeenCalledWith(LINK_TRACKING_EVENT, { data });
        });

        it('should perform an analytics call when clicking on android app banner ', () => {
            // Arrange
            const processStub = spyOn(processEvent, 'process');
            digitalData.page.attributes.previousPageData.pageName = 'home page:home page:n/a:*';
            const data = {
                actionInfo: 'footer:downloadtheapp:android',
                linkName: 'footer:downloadtheapp:android',
                eventStrings: ['event71'],
                previousPage: 'home page:home page:n/a:*'
            };

            // Act
            shallowComponent.find('#appBanners_android').simulate('click');

            // Assert
            expect(processStub).toHaveBeenCalledWith(LINK_TRACKING_EVENT, { data });
        });

        describe('App download message', () => {
            const getText = localeUtils.getLocaleResourceFile('components/Footer/locales', 'Footer');

            it('should display the correct message and SMS number for CA locale', () => {
                spyOn(localeUtils, 'isCanada').and.returnValue(true);
                const wrapper = shallowComponent;
                const smsMessageUS = wrapper.contains(getText('textApp'));

                expect(smsMessageUS).toEqual(true);
            });

            it('should display the correct message and SMS number for US locale', () => {
                spyOn(localeUtils, 'isCanada').and.returnValue(false);
                const wrapper = shallowComponent;
                const smsMessageCanada = wrapper.contains(getText('textApp'));

                expect(smsMessageCanada).toEqual(true);
            });
        });
    });

    // describe('eVar64', () => {
    //     it('should set eVar64 for s.t call on the next pageload event', () => {
    //         // Arrange
    //         const navigationInfo = 'toolbar nav:find a store:find a store:find a store:find a store';

    //         // Act
    //         shallowComponent.find('footer > Container > div > a[data-at="sephora_near_me"]').simulate('click');

    //         // Assert
    //         const previousPageData = analyticsUtils.getPreviousPageData();
    //         expect(previousPageData).toEqual(objectContaining({ navigationInfo }));
    //     });
    // });

    describe('Test data-at attributes', () => {
        it('should render data-at attribute set to "personalized_footer_msg"', () => {
            // Arrange
            const wrapper = shallowComponent;

            // Act
            const dataAt = wrapper.findWhere(n => n.prop('data-at') === 'personalized_footer_msg');

            // Assert
            expect(dataAt.length).toEqual(1);
        });
    });

    describe('CCPA link', () => {
        beforeEach(() => {
            Storage.session.setItem(LOCAL_STORAGE.IS_CALIFORNIA_CONSUMER, null);
        });

        it('Should render Clarip Privacy link for Canada', () => {
            spyOn(localeUtils, 'isCanada').and.returnValue(true);
            Sephora.configurationSettings.isClaripPrivacyEnabled = true;

            Storage.session.setItem(LOCAL_STORAGE.SELECTED_STORE, {
                address: {
                    address1: '200 Hamilton Avenue',
                    address2: '',
                    city: 'Palo Alto',
                    country: 'US',
                    crossStreet: '',
                    fax: '',
                    mallName: 'Biltmore Fashion Park',
                    phone: '(602) 957-9400',
                    postalCode: '94301',
                    state: 'AZ'
                }
            });

            const wrapper = shallow(<Footer {...props} />);
            const legalSection = wrapper.find('[data-at="footer_legal_section"]');
            expect(legalSection.props().children[2].props.children[4].props.children.props.children[0]).toBe('Cookie Preferences');
        });

        it('Should render Clarip Privacy link for US', () => {
            spyOn(localeUtils, 'isCanada').and.returnValue(false);
            Sephora.configurationSettings.isClaripPrivacyEnabled = false;

            Storage.session.setItem(LOCAL_STORAGE.SELECTED_STORE, {
                address: {
                    address1: '200 Hamilton Avenue',
                    address2: '',
                    city: 'Palo Alto',
                    country: 'US',
                    crossStreet: '',
                    fax: '',
                    mallName: 'Biltmore Fashion Park',
                    phone: '(602) 957-9400',
                    postalCode: '94301',
                    state: 'AZ'
                }
            });

            const wrapper = shallow(<Footer {...props} />);
            const legalSection = wrapper.find('[data-at="footer_legal_section"]');
            expect(legalSection.props().children[2].props.children[4].props.children.props.children[0]).toBe('Your Privacy Choices');
        });
    });
});
