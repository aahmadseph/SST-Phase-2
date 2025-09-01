const React = require('react');
const { shallow } = require('enzyme');
const { createSpy } = jasmine;

describe('GalleryCardCarousel component', () => {
    let uiUtils;
    let biProfile;
    let GalleryCardCarousel;
    let communityUtils;
    let processEvent;
    let anaConsts;
    let productMediaStub;
    let props;
    let processSpy;

    beforeEach(() => {
        uiUtils = require('utils/UI').default;
        biProfile = require('utils/BiProfile').default;
        GalleryCardCarousel = require('components/ProductPage/GalleryCardCarousel/GalleryCardCarousel').default;
        communityUtils = require('utils/Community').default;
        processEvent = require('analytics/processEvent').default;
        anaConsts = require('analytics/constants').default;
        processSpy = spyOn(processEvent, 'process');

        Sephora.configurationSettings.productPageConfigurations.isPpagePhotosEnabled = true;

        productMediaStub = [
            {
                url: {},
                uploader: {}
            },
            {
                url: {},
                uploader: {}
            },
            {
                url: {},
                uploader: {}
            }
        ];
        props = {
            title: 'galleryTitle',
            productId: 123456,
            currentProduct: { reviewFilters: [] },
            setCarouselGallery: createSpy()
        };
        spyOn(uiUtils, 'getBreakpoint').and.returnValue('xs');
    });

    it('should render no images text data-at on no images', () => {
        // Arrange
        const component = shallow(<GalleryCardCarousel {...props} />);
        const instance = component.instance();
        spyOn(instance, 'shouldDisplayGallery').and.returnValue(true);

        // Act
        component.setState({ medias: productMediaStub });
        component.setState({
            medias: [],
            displayFilter: true
        });

        // Assert
        const elementName = component.findWhere(n => n.prop('dataAt') === 'no_images_see_it_real_carousel').name();
        expect(elementName).toEqual('Text');
    });

    it('should render nothing if no media provided', () => {
        // Act
        const component = shallow(<GalleryCardCarousel {...props} />);

        // Assert
        expect(component.isEmptyRender()).toBeTruthy();
    });

    it('should update visible items with new value', () => {
        // Arrange
        const component = shallow(<GalleryCardCarousel {...props} />);
        component.setState({ visibleItems: 0 });
        const instance = component.instance();

        // Act
        instance.updateVisibleItems(2.5);

        // Assert
        expect(instance.state.visibleItems).toEqual(2);
    });

    it('should render Text title data-at', () => {
        const component = shallow(<GalleryCardCarousel {...props} />);
        const instance = component.instance();
        spyOn(instance, 'shouldDisplayGallery').and.returnValue(true);

        component.setState({ medias: productMediaStub });

        const elementName = component.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('see_it_in_real_life_title')}`).name();
        expect(elementName).toEqual('Text');
    });

    it('should render Link photo data-at', () => {
        const component = shallow(<GalleryCardCarousel {...props} />);
        const instance = component.instance();
        spyOn(instance, 'shouldDisplayGallery').and.returnValue(true);

        component.setState({ medias: productMediaStub });

        const elementName = component.findWhere(n => n.prop('data-at') === `${Sephora.debug.dataAt('add_your_photo_link')}`).name();
        expect(elementName).toEqual('Link');
    });

    it('should render data-at', () => {
        const component = shallow(<GalleryCardCarousel {...props} />);
        const instance = component.instance();
        spyOn(instance, 'shouldDisplayGallery').and.returnValue(true);

        component.setState({ medias: productMediaStub });

        const dataAt = component.find('[data-at="see_it_in_real_life_section"]');
        expect(dataAt.exists()).toBeTruthy();
    });

    describe('toggle', () => {
        it('it should call ensureUserIsReadyForSocialAction', () => {
            const ensureUserIsReadyForSocialActionStub = spyOn(communityUtils, 'ensureUserIsReadyForSocialAction').and.returnValue({
                then: createSpy().and.returnValue({ catch: () => {} })
            });
            const wrapper = shallow(<GalleryCardCarousel {...props} />);
            const component = wrapper.instance();
            component.toggle();
            expect(ensureUserIsReadyForSocialActionStub).toHaveBeenCalledWith(communityUtils.PROVIDER_TYPES.lithium);
        });
    });

    describe('isObservable', () => {
        it('should return false for first item of carousel', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const isObservable = instance.isObservable(0, 2.5);

            // Assert
            expect(isObservable).toBeFalsy();
        });

        it('should return false for last full item of the current page', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const isObservable = instance.isObservable(2, 2.5);

            // Assert
            expect(isObservable).toBeFalsy();
        });

        it('should return true for last item of the next page', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const isObservable = instance.isObservable(4, 2.5);

            // Assert
            expect(isObservable).toBeTruthy();
        });
    });

    describe('isGift', () => {
        it('should return false for the nullish biType', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const isGift = instance.isGift(null);

            // Assert
            expect(isGift).toBeFalsy();
        });

        it('should return false for the birthday gift', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const isGift = instance.isGift('birthday gift');

            // Assert
            expect(isGift).toBeFalsy();
        });

        it('should return false for the rouge birthday gift', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const isGift = instance.isGift('rouge birthday gift');

            // Assert
            expect(isGift).toBeFalsy();
        });

        it('should return false for the welcome kit', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const isGift = instance.isGift('welcome kit');

            // Assert
            expect(isGift).toBeFalsy();
        });

        it('should return true for any biType not from exclude list', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const isGift = instance.isGift('SomeBiTypeNotFromExcludeList');

            // Assert
            expect(isGift).toBeTruthy();
        });
    });

    describe('shouldDisplayGallery', () => {
        beforeEach(() => {
            Sephora.configurationSettings.productPageConfigurations = {};
            Sephora.configurationSettings.productPageConfigurations.isPpageBeautyBoardEnabled = true;
        });

        it('should return false if PpageBeautyBoard is not Enabled', () => {
            // Arrange
            Sephora.configurationSettings.productPageConfigurations.isPpageBeautyBoardEnabled = false;
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const displayGallery = instance.shouldDisplayGallery();

            // Assert
            expect(displayGallery).toBeFalsy();
        });

        it('should return false for 1065 brandId', () => {
            // Arrange
            props.brandId = '1065';
            props.skuType = 'SomeSkuWithLooks';
            props.biType = 'birthday gift';
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const displayGallery = instance.shouldDisplayGallery();

            // Assert
            expect(displayGallery).toBeFalsy();
        });

        it('should return false for sample skuType', () => {
            // Arrange
            props.brandId = 'SomeBrandWithLooks';
            props.skuType = 'sample';
            props.biType = 'birthday gift';
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const displayGallery = instance.shouldDisplayGallery();

            // Assert
            expect(displayGallery).toBeFalsy();
        });

        it('should return false for gwp skuType', () => {
            // Arrange
            props.brandId = 'SomeBrandWithLooks';
            props.skuType = 'gwp';
            props.biType = 'birthday gift';
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const displayGallery = instance.shouldDisplayGallery();

            // Assert
            expect(displayGallery).toBeFalsy();
        });

        it('should return false for msg skuType', () => {
            // Arrange
            props.brandId = 'SomeBrandWithLooks';
            props.skuType = 'msg';
            props.biType = 'birthday gift';
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const displayGallery = instance.shouldDisplayGallery();

            // Assert
            expect(displayGallery).toBeFalsy();
        });

        it('should return true for brand & sku & biType with Looks', () => {
            // Arrange
            props.brandId = 'SomeBrandWithLooks';
            props.skuType = 'SomeSkuWithLooks';
            props.biType = 'birthday gift';
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();

            // Act
            const displayGallery = instance.shouldDisplayGallery();

            // Assert
            expect(displayGallery).toBeTruthy();
        });
    });

    describe('handleResize', () => {
        it('should change isFlush state to false if containerPaddedMatches', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();
            instance.state = {
                isFlush: true,
                selectedFilters: {}
            };
            const setStateSpy = spyOn(instance, 'setState');
            spyOn(instance, 'containerPaddedMatches').and.returnValue(true);

            // Act
            instance.handleResize();

            // Assert
            expect(setStateSpy).toHaveBeenCalledWith({ isFlush: false });
        });

        it('should change isFlush state to true if not containerPaddedMatches', () => {
            // Arrange
            const component = shallow(<GalleryCardCarousel {...props} />);
            const instance = component.instance();
            instance.state = {
                isFlush: false,
                selectedFilters: {}
            };
            const setStateSpy = spyOn(instance, 'setState');
            spyOn(instance, 'containerPaddedMatches').and.returnValue(false);

            // Act
            instance.handleResize();

            // Assert
            expect(setStateSpy).toHaveBeenCalledWith({ isFlush: true });
        });
    });

    describe('toggleBeautyMatches()', () => {
        it('should apply mapped contextual Traits from filtersConfiguration', () => {
            const biInfo = {
                someTrait1: 'someValue11',
                someTrait2: 'someValue21'
            };
            spyOn(biProfile, 'getBiProfileInfo').and.returnValue(biInfo);
            spyOn(biProfile, 'hasAllTraits').and.returnValue(true);
            props.currentProduct.reviewFilters = [
                {
                    id: 'someTrait1',
                    contextual: true,
                    options: [{ value: 'someValue11' }, { value: 'someValue12' }]
                },
                {
                    id: 'someTrait2',
                    contextual: false,
                    options: [{ value: 'someValue21' }, { value: 'someValue22' }]
                }
            ];
            const wrapper = shallow(<GalleryCardCarousel {...props} />, { disableLifecycleMethods: true });
            const component = wrapper.instance();
            component.state = { selectedFilters: {} };
            const applyFiltersSpy = spyOn(component, 'applyFilters');

            component.toggleBeautyMatches();

            const expectedFilters = {
                ['someTrait1']: [biInfo['someTrait1']],
                ['beautyMatches']: ['true']
            };
            expect(applyFiltersSpy).toHaveBeenCalledWith(expectedFilters);
        });

        it('should remove mapped contextual Trait value from filtersConfiguration from the selection', () => {
            const biInfo = {
                someTrait1: 'someValue11',
                someTrait2: 'someValue21'
            };
            spyOn(biProfile, 'getBiProfileInfo').and.returnValue(biInfo);
            spyOn(biProfile, 'hasAllTraits').and.returnValue(true);
            props.currentProduct.reviewFilters = [
                {
                    id: 'someTrait1',
                    contextual: true,
                    options: [{ value: 'someValue11' }, { value: 'someValue12' }]
                },
                {
                    id: 'someTrait2',
                    contextual: false,
                    options: [{ value: 'someValue21' }, { value: 'someValue22' }]
                }
            ];
            const wrapper = shallow(<GalleryCardCarousel {...props} />, { disableLifecycleMethods: true });
            const component = wrapper.instance();
            component.state = {
                selectedFilters: {
                    beautyMatches: ['true'],
                    someTrait1: ['someValue11']
                }
            };
            const applyFiltersSpy = spyOn(component, 'applyFilters');

            component.toggleBeautyMatches();

            const expectedFilters = {
                ['someTrait1']: [],
                beautyMatches: []
            };
            expect(applyFiltersSpy).toHaveBeenCalledWith(expectedFilters);
        });
    });

    describe('applyFilters', () => {
        it('should track analytics with the correct data', () => {
            // Arrange
            const filtersApplied = 'skin concerns=Acne|skin type=Combination|beauty matches=true';
            const action = 'see it in real life:filter';
            const eventData = {
                data: {
                    actionInfo: action,
                    linkName: action,
                    filterSelections: filtersApplied,
                    selectedFilter: filtersApplied,
                    eventStrings: anaConsts.Event.EVENT_71
                }
            };
            const component = new GalleryCardCarousel(props);

            // Act
            component.applyFilters({
                skinConcerns: ['Acne'],
                skinType: ['Combination'],
                beautyMatches: ['true']
            });

            // Assert
            expect(processSpy).toHaveBeenCalledWith(anaConsts.LINK_TRACKING_EVENT, eventData);
        });
    });
});
