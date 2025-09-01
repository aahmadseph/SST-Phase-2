const React = require('react');
const { shallow } = require('enzyme');
const Image = require('components/Bcc/BccImage/BccImage').default;
const BCC = require('utils/BCC').default;
const processEvent = require('analytics/processEvent').default;
const Store = require('Store').default;

describe('BccImage component', () => {
    let dispatchStub;
    let component;
    let processStub;

    beforeEach(() => {
        dispatchStub = spyOn(Store, 'dispatch');
        processStub = spyOn(processEvent, 'process');
    });

    describe('BccImage.prototype.toggleHover', () => {
        beforeEach(() => {
            Sephora.isTouch = false;
            spyOn(Sephora, 'isDesktop').and.returnValue(true);
        });

        it('should change the value of state.hover to false', () => {
            // Arrange
            component = shallow(<Image />).instance();
            component.setState({ hover: true });

            // Act
            component.toggleHover();

            // Assert
            expect(component.state.hover).toBeFalsy();
        });

        it('should change the value of state.hover to true', () => {
            // Arrange
            component = shallow(<Image />).instance();
            component.setState({ hover: false });

            // Act
            component.toggleHover();

            // Assert
            expect(component.state.hover).toBeTruthy();
        });
    });

    it('should dispatch showBccModal on BccImage.prototype.toggleOpen', () => {
        // Arrange
        const props = { modalTemplate: {} };
        component = shallow(<Image {...props} />).instance();

        // Act
        component.toggleOpen();

        // Assert
        expect(processStub).toHaveBeenCalledTimes(1);
        expect(dispatchStub).toHaveBeenCalled();
    });

    describe('BccImage.handleTestTarget', () => {
        let offers;

        beforeEach(() => {
            component = shallow(<Image />).instance();
            offers = {
                testTarget: {
                    requiredKeys: {
                        altText: 'a',
                        bannerImageUrl: 'b',
                        landingPageUrl: 'c'
                    },
                    missingRequiredKeys: {
                        landingPageUrl: 'a',
                        width: 'b',
                        height: 'c'
                    }
                }
            };
        });

        it('should return new object if all required prop keys are passed', () => {
            // Act
            const result = component.handleTestTarget(offers.testTarget.requiredKeys);

            // Assert
            expect(result).toEqual(
                jasmine.objectContaining({
                    altText: offers.testTarget.requiredKeys.altText,
                    imagePath: offers.testTarget.requiredKeys.bannerImageUrl,
                    targetScreen: { targetUrl: offers.testTarget.requiredKeys.landingPageUrl }
                })
            );
        });

        it('should return null if all required prop keys are not passed', () => {
            // Act
            const result = component.handleTestTarget(offers.testTarget.missingRequiredKeys);

            // Assert
            expect(result).toBe(null);
        });

        it('should return mobile image height if isMobile is true', () => {
            // Arrange
            spyOn(Sephora, 'isMobile').and.returnValue(true);

            // Act
            const result = component.handleTestTarget(offers.testTarget.requiredKeys);

            // Assert
            expect(result.height).toBe(BCC.ADAPTATIVE_IMAGE_SIZES.MOBILE_HEIGHT);
        });

        it('should return desktop image height if isMobile is false', () => {
            // Arrange
            spyOn(Sephora, 'isMobile').and.returnValue(false);

            // Act
            const result = component.handleTestTarget(offers.testTarget.requiredKeys);

            // Assert
            expect(result.height).toBe(BCC.ADAPTATIVE_IMAGE_SIZES.DESKTOP_HEIGHT);
        });
    });

    describe('ShadeFinder Quiz', () => {
        const props = {
            altText: 'Find a just-right-for-you foundation | Take the quiz > ',
            componentName: 'Sephora Unified Image Component',
            componentType: 53,
            contextualParentTitles: undefined,
            disableLazyLoad: true,
            height: '75',
            imageId: 'ufeweb3790242',
            imagePath: '/contentimages/ppagebanners/2018-08-09-nth-level-banner-foundation-finder-us-ca-d-slice.jpg',
            isBccStyleWrapperApplied: true,
            isContained: false,
            name: 'search_banner_foundationquiz_image',
            origin: null,
            parentTitle: undefined,
            targetScreen: { targetUrl: 'MULTISHADEFINDER' },
            width: '777'
        };

        beforeEach(() => {
            component = shallow(<Image {...props} />);
        });

        it('expect href to be null ', () => {
            expect(component.props().children.props.href).toBe(null);
        });
    });
});
