const React = require('react');
const { shallow } = require('enzyme');

describe('BeautyWinPromoBody component', () => {
    let userUtils;
    let BeautyWinPromo;
    let anaConsts;
    let analyticsUtils;
    let urlUtils;
    let dateUtils;
    let props;

    beforeEach(() => {
        userUtils = require('utils/User').default;
        dateUtils = require('utils/Date').default;
        BeautyWinPromo = require('components/BeautyWinPromo/BeautyWinPromoBody').default;
        anaConsts = require('analytics/constants').default;
        analyticsUtils = require('analytics/utils').default;
        urlUtils = require('utils/Url').default;
        props = {
            regions: {
                content: []
            }
        };
    });

    describe('should render landing page', () => {
        let wrapper;
        let getDayOfWeekStub;
        let getDateInMMDDYYFormatStub;
        beforeEach(() => {
            getDayOfWeekStub = spyOn(dateUtils, 'getDayOfWeek').and.returnValue(['Wednesday']);
            getDateInMMDDYYFormatStub = spyOn(dateUtils, 'getDateInMMDDYYFormat').and.returnValue('07/22/20');
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            wrapper = shallow(<BeautyWinPromo {...props} />);
            wrapper.setState({
                firstName: 'John',
                isAvailable: true,
                promoCode: 'tlpTest',
                promoEndDate: '2020-07-22 00:00:00',
                promoReason: 'PromoReason'
            });
        });
        it('should render userName', () => {
            expect(wrapper.find('Text').at(0).prop('children')).toBe('John,');
        });

        it('should render button', () => {
            expect(wrapper.find('Button').prop('children')).toBe('Shop Now');
        });

        it('should render Promo end date', () => {
            expect(wrapper.find('Text').at(5).prop('children')).toBe('Valid Until Wednesday, 07/22/20');
        });

        it('should call getDayOfWeekStub', () => {
            expect(getDayOfWeekStub).toHaveBeenCalled();
        });

        it('should call getDateInMMDDYYFormat', () => {
            expect(getDateInMMDDYYFormatStub).toHaveBeenCalled();
        });

        it('should test data-at for title', () => {
            expect(wrapper.find('[data-at="why_you_got_this_title"]').exists()).toBe(true);
        });

        it('should test data-at for text', () => {
            expect(wrapper.find('[data-at="why_you_got_this_text"]').exists()).toBe(true);
        });
    });

    describe('should render signInPage', () => {
        let wrapper;

        beforeEach(() => {
            wrapper = shallow(<BeautyWinPromo {...props} />);
            wrapper.setState({ isAnonymous: true });
        });

        it('should render userName', () => {
            expect(wrapper.find('Text').at(0).prop('children')).toBe('Please sign in to access Your Sephora Beauty Win.');
        });

        it('should test data-at for title', () => {
            expect(wrapper.find('Text[data-at="tlp_promo_error_message_first_line"]').exists()).toBe(true);
        });
        it('should test data-at for title', () => {
            expect(wrapper.find('Text[data-at="tlp_promo_error_message_second_line"]').exists()).toBe(true);
        });
    });

    describe('Not Available state', () => {
        let wrapper;

        beforeEach(() => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            wrapper = shallow(<BeautyWinPromo {...props} />);
        });

        it('should render Not available message', () => {
            // Act
            wrapper.setState({
                firstName: 'John',
                isDataReady: true,
                isAvailable: false,
                isAnonymous: false,
                isExpired: false
            });

            // Assert
            expect(wrapper.find('Text').at(1).prop('children')).toBe(
                'You don\'t qualify for Your Sephora Beauty Win at this time, but we have lots of other great offers going on—check them out.'
            );
        });

        it('should render nothing if data is not ready yet', () => {
            // Act
            wrapper.setState({
                firstName: 'John',
                isDataReady: false,
                isAvailable: false,
                isAnonymous: false
            });

            // Assert
            expect(wrapper.find('Text').length).toBe(0);
        });
    });

    describe('Is Expired state', () => {
        let wrapper;

        beforeEach(() => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            wrapper = shallow(<BeautyWinPromo {...props} />);
        });

        it('should render Is Expired message', () => {
            // Act
            wrapper.setState({
                firstName: 'John',
                isDataReady: true,
                isExpired: true,
                isAnonymous: false
            });

            // Assert
            expect(wrapper.find('Text').at(1).prop('children')).toBe(
                'Your Sephora Beauty Win has expired—but we have lots of other great offers going on.'
            );
        });

        it('should render nothing if data is not ready yet', () => {
            // Act
            wrapper.setState({
                firstName: 'John',
                isDataReady: false,
                isAvailable: false,
                isAnonymous: false
            });

            // Assert
            expect(wrapper.find('Text').length).toBe(0);
        });
    });

    describe('Request Failure state', () => {
        let wrapper;

        beforeEach(() => {
            spyOn(userUtils, 'isAnonymous').and.returnValue(false);
            wrapper = shallow(<BeautyWinPromo {...props} />);
        });

        it('should render Failure message', () => {
            // Act
            wrapper.setState({ requestFailed: true });

            // Assert
            expect(wrapper.find('Text').at(1).prop('children')).toBe('Try searching or go to our home page to continue shopping.');
        });
    });

    describe('setAnalytics', () => {
        let wrapper;
        let component;

        beforeEach(() => {
            wrapper = shallow(<BeautyWinPromo {...props} />);
            component = wrapper.instance();
            component.setAnalytics();
        });

        it('should set the correct pageType', () => {
            expect(digitalData.page.category.pageType).toEqual(anaConsts.PAGE_TYPES.CONTENT_STORE);
        });

        it('should set the correct pageName', () => {
            expect(digitalData.page.pageInfo.pageName).toEqual('beauty offers-your promo');
        });
    });

    describe('should render barcode', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = shallow(<BeautyWinPromo {...props} />);
            wrapper.setState({
                firstName: 'John',
                isDataReady: true,
                isExpired: true,
                isAnonymous: false,
                isOnlineOnly: false,
                promoCode: '123456',
                isAvailable: true
            });
        });

        it('should test if barcode is present', () => {
            expect(wrapper.find('Barcode').exists()).toBe(true);
        });

        it('should render the Barcode with an id prop equal to promoCode provided', () => {
            expect(wrapper.findWhere(n => n.name() === 'Barcode' && n.props().id === '123456').length).toEqual(1);
        });
    });

    describe('should not render barcode', () => {
        let wrapper;
        beforeEach(() => {
            wrapper = shallow(<BeautyWinPromo {...props} />);
            wrapper.setState({
                firstName: 'John',
                isDataReady: true,
                isExpired: true,
                isAnonymous: false,
                isOnlineOnly: true,
                promoCode: '123456',
                isAvailable: true
            });
        });

        it('should test if barcode is present', () => {
            expect(wrapper.find('Barcode').exists()).toBe(false);
        });
    });

    describe('handleShopNowClick', () => {
        let wrapper;
        let component;
        let setNextPageDataStub;
        let redirectToStub;
        let promoCtaLink;
        let prop55;
        let bckpPageName;
        let bckpPageType;

        beforeEach(() => {
            setNextPageDataStub = spyOn(analyticsUtils, 'setNextPageData');
            redirectToStub = spyOn(urlUtils, 'redirectTo');
            wrapper = shallow(<BeautyWinPromo {...props} />);
            component = wrapper.instance();
            promoCtaLink = '/beauty/beauty-offers';
            prop55 = 'your promo:shop now';
            bckpPageName = digitalData.page.attributes.sephoraPageInfo.pageName;
            bckpPageType = digitalData.page.category.pageType;

            wrapper.setState({ promoCtaLink });
        });

        it('should send next page analytics data', () => {
            // Arrange
            digitalData.page.attributes.sephoraPageInfo.pageName = 'tlpPageName';
            digitalData.page.category.pageType = 'tlpPpageType';

            // Act
            component.handleShopNowClick(promoCtaLink);

            // Assert
            expect(setNextPageDataStub).toHaveBeenCalledWith({
                pageName: 'tlpPageName',
                pageType: 'tlpPpageType',
                linkData: prop55
            });
            expect(redirectToStub).toHaveBeenCalledWith(promoCtaLink);
        });

        afterEach(() => {
            digitalData.page.attributes.sephoraPageInfo.pageName = bckpPageName;
            digitalData.page.category.pageType = bckpPageType;
        });
    });
});
